# Houzy

Home sharing fullstack app [React + Node + GraphQL + TS]

### How to run the app

1. In both frontend and backend folders you can find a sample of the variables you would need in your `.env` file. Some of them are relatively trivial if you want to try the app in development. An example of this could be `PORT` or `SECRET`.
2. Prior to jump into your `.env` you need to make sure you have accounts in the following services
   2.1 MongoDB Atlas. From here you will need to create a cluster and get `DB_USER`, `DB_USER_PASSWORD` and `DB_CLUSTER`. Then you should be able to seed the data you can find within this project folder.
   2.2 Google. From here you will to get `G_CLIENT_ID` and `G_CLIENT_SECRET` for the OAuth part of the app and `G_GEOCODE_KEY` for the Geocode involved in the listing search by location. Remember to have a billable account even if you take advantage of the Free tier (200 usd per month). If not will fail.
   2.3 Cloudinary. Here you will need to create a project space although is super simple. Then you should be able to get values for the following `CLOUDINARY_NAME`, `CLOUDINARY_KEY` and`CLOUDINARY_SECRET`
   2.4 Stripe. Here you will need to get env variables for both frontend and backend. Concretely you should look into the developer tab and also into the settings associated with Stripe connect. You need to make sure you enable in test mode oAuth for both `Express` and `Standard`. Then grab the `REACT_APP_STRIPE_CLIENT_ID`. In developer settings you should be able to find teh keys for `REACT_APP_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`. Despite the slightly different name, in both backend and frontend environmental variables you should place the same Stripe client id.
   2.4 Once you have all those 3rd party services configured you should be good to go
3. If you did not do it yet, seed the db with the data you can find within `/backend`
4. Install dependencies from both `/frontend` and `/backend`.
5. At this point you should be able to run first `yarn run start` to initialize the backend
6. Then before starting the frontend you would need to run both `codegen:schema-download` and `codegen:generate-types`. What it does is basically looking into your `graphql/api` that you are running now plus also into the queries and mutations defined in `gql` language within `src/graphql` in the frontend folder. Downloads a massive definition file with everything and then the second command generates based on that file, appropiate Typescript types for those queries and mutations within a bunch of subfolders all called by the name `__generated__`
