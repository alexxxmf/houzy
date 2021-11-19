import stripe from "stripe";

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

const FEE_TO_BE_COLLECTED = 0.05;

export const Stripe = {
  connect: async (code: string) => {
    try {
      const response = await client.oauth.token({
        grant_type: "authorization_code",
        code,
      });
      if (!response) {
        return new Error("failed to connect to Stripe!");
      }
      return response;
    } catch (e) {
      return new Error("failed to connect to Stripe!");
    }
  },
  disconnect: async (stripeUserId: string) => {
    try {
      const response = await client.oauth.deauthorize({
        client_id: `${process.env.STRIPE_CLIENT_ID}`,
        stripe_user_id: stripeUserId,
      });
      return response;
    } catch (e) {
      throw new Error("there was a problem while disconnecting");
    }
  },
  charge: async (
    amount: number,
    source: string,
    stripeAccount: string
  ): Promise<void> => {
    try {
      console.log("amount", amount);
      console.log("source", source);
      console.log("stripeAccount", stripeAccount);

      const res = await client.charges.create(
        {
          amount,
          currency: "eur",
          source: "tok_amex",
          application_fee_amount: Math.round(amount * FEE_TO_BE_COLLECTED),
        },
        {
          stripeAccount,
        }
      );

      if (res.status !== "succeeded") {
        throw new Error("failed to create charge with Stripe");
      }
    } catch (e) {
      console.log("e", e);
      throw new Error("Stripe error");
    }
  },
};
