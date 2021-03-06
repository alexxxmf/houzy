import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Context, User, Viewer } from "../../../lib/types";
import { ConnectStripeArgs, LogInArgs } from "./types";
import { authorize } from "../../../utils";
import { Stripe } from "../../../lib/api";
import { Stripe as st } from "stripe";

const KEY_VIEWER_COOKIE = "viewer";

const cookieOptions = {
  httpOnly: true,
  sameSite: false,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

export const logInViaGoogle = async (
  code: string,
  token: string,
  db: Context["db"],
  res: Context["res"]
): Promise<User | undefined> => {
  // If a bad formed code is being passed we should expect this error | invalid_grant
  // data: { error: 'invalid_grant', error_description: 'Malformed auth code.'}
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google login error");
  }

  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  const userName = userNamesList ? userNamesList[0].displayName : null;

  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  const userAvatar = userPhotosList?.[0].url ?? null;

  const userEmail = userEmailsList?.[0].value ?? null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  res.cookie(KEY_VIEWER_COOKIE, userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: Context["db"],
  req: Context["req"],
  res: Context["res"]
): Promise<User | undefined> => {
  const updateRes = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  const viewer = updateRes.value;

  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      try {
        return Google.authUrl;
      } catch (e) {
        throw new Error(`Failed to query Google Auth Url: ${e}`);
      }
    },
  },

  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, res, req }: Context
    ) => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (e) {
        throw new Error(`Failed to log in: ${e}`);
      }
    },
    logOut: (
      _root: undefined,
      _variables: undefined,
      { res }: Context
    ): Viewer => {
      try {
        res.clearCookie(KEY_VIEWER_COOKIE, cookieOptions);

        return { didRequest: true };
      } catch (e) {
        throw new Error(`Failed to log out: ${e}`);
      }
    },
    connectStripe: async (
      _root: undefined,
      { input }: ConnectStripeArgs,
      { db, req }: Context
    ): Promise<Viewer> => {
      try {
        const { code } = input;

        let viewer = await authorize(db, req);

        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const wallet = (await Stripe.connect(code)) as st.OAuthToken;

        if (!wallet || !wallet.stripe_user_id) {
          throw new Error("stripe grant error");
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: wallet.stripe_user_id } },
          { returnOriginal: false }
        );

        if (!updateRes.value) {
          throw new Error("viewer could not be updated");
        }

        viewer = updateRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to connect with Stripe ${error}`);
      }
    },
    disconnectStripe: async (
      _root: undefined,
      _args: undefined,
      { db, req }: Context
    ): Promise<Viewer> => {
      try {
        let viewer = await authorize(db, req);

        if (!viewer || !viewer.walletId) {
          throw new Error("viewer cannot be found");
        }

        const wallet = await Stripe.disconnect(viewer.walletId);

        if (!wallet) {
          throw new Error("stripe disconnect error");
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: undefined } },
          { returnOriginal: false }
        );

        if (!updateRes.value) {
          throw new Error("viewer could not be updated");
        }

        viewer = updateRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch {
        throw new Error("Failed to disconnect from stripe");
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};
