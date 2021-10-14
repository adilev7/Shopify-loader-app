import "@babel/polyfill";
import "isomorphic-fetch";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import dotenv from "dotenv";

const koaBody = require("koa-body");
const json = require("koa-json");
const cors = require("koa-cors");

import * as handlers from "./handlers";
import shopRouter from "./routes/shop";
import gifRouter from "./routes/gif";
import shopControl from "./controllers/shop";
import { getBillingStatus } from "./handlers/queries/get-billing-status";
import verifyToken from "./middlewares/verifyToken";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.July21,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

// Build ACTIVE_SHOPIFY_SHOPS obect
shopControl
  .getAllShops()
  .then((shops) => {
    if (shops?.length) {
      return shops.map(({ shop }) => {
        ACTIVE_SHOPIFY_SHOPS[shop] = process.env.SCOPES;
        debugger;
      });
    }
  })
  .catch((err) => console.log(err));

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server
    .use(json())
    .use(koaBody())
    .use(cors({ origin: "*", headers: ["Access-Control-Allow-Origin"] }))
    .use(
      createShopifyAuth({
        async afterAuth(ctx) {
          // Access token and shop available in ctx.state.shopify
          const { shop, accessToken, scope } = ctx.state.shopify;
          if (!ACTIVE_SHOPIFY_SHOPS[shop]) {
            ACTIVE_SHOPIFY_SHOPS[shop] = scope;
            await shopControl.createShop(shop, accessToken);
          }

          const response = await Shopify.Webhooks.Registry.register({
            shop,
            accessToken,
            path: "/webhooks",
            topic: "APP_UNINSTALLED",
            webhookHandler: async (topic, shop, body) => {
              delete ACTIVE_SHOPIFY_SHOPS[shop];
              await shopControl.deleteShop(shop);
            },
          });

          if (!response.success) {
            console.log(
              `Failed to register APP_UNINSTALLED webhook: ${response.result}`
            );
          }

          ctx.shop = shop;
          ctx.queryHost = ctx.query.host;
          ctx.accessToken = accessToken;
          ctx.client = handlers.createClient(ctx);

          const confirmationUrl = await handlers
            .getSubscriptionUrl(ctx)
            .catch((err) => console.log("getSubscriptionUrl", err));
          ctx.redirect(confirmationUrl);
        },
      })
    );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.get("Check billing", "/billing", verifyToken, async (ctx, next) => {
    ctx.client = handlers.createClient(ctx);
    ctx.queryHost = Buffer.from(ctx.query.shop).toString("base64");
    const { billed, initialized } = await shopControl
      .getShop(ctx.shop)
      .catch((err) => {
        ctx.throw(err);
      });
    const billingStatus = await getBillingStatus(ctx).catch((err) => {
      console.log(new Error(`Failed to fetch billing status: ${err}`));
      ctx.throw(err);
    });
    if (billingStatus !== "ACTIVE") {
      const confirmationUrl = await handlers
        .getSubscriptionUrl(ctx)
        .catch((err) => {
          console.log("getSubscriptionUrl", err);
          ctx.throw(err);
        });
      ctx.body = confirmationUrl;
      return;
    }
    if (!billed) {
      await shopControl.updateBillingStatus(ctx.shop, true);
    }
    if (!initialized) {
      await handlers.initApp(ctx).catch((err) => {
        console.log({ "initApp ERROR": err });
        ctx.throw(err);
      });
    }

    ctx.body = null;
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  server
    .use(shopRouter.routes())
    .use(shopRouter.allowedMethods())

    .use(gifRouter.routes())
    .use(gifRouter.allowedMethods());

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(router.routes()).use(router.allowedMethods());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
