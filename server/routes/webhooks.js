import dotenv from "dotenv";
dotenv.config();
import Shopify from "../config/shopifyInit";
import { receiveWebhook } from "@shopify/koa-shopify-webhooks";
const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });
const Router = require("koa-router");
const router = new Router();

/* App Uninstall */
router.post("/webhooks/app-uninstall", async (ctx) => {
  try {
    await Shopify.Webhooks.Registry.process(ctx.req, ctx.res); // Invokes webhookHandler function (server.js)
    ctx.body = `App uninstalled for shop: ${ctx.headers["x-shopify-shop-domain"]}`;
  } catch (error) {
    console.log(
      `Failed to process webhook '/webhooks/app-uninstall': ${error}`
    );
  }
});

/* ========== GDPR Webhooks ========== */
// App must respond to all GDPR webhooks with status 200.
// Requests will reach these endpoints depending on the app's scopes.
// If the app doesn't have permission to customer or order data, the requests won't reach these endpoints.
/* =================================== */

/* Customers Data Request */
// The buyer's request from the shop to view his available information
// Upon receipt of the webhook, the app should manually contact the customer using the information provided by the request.
// **Relevant only for apps that have access to customers scopes (READ_CUSTOMERS etc.), otherwise respond with 200.
// Request body:
/* 
  {
    "shop_id": 954889,
    "shop_domain": "snowdevil.myshopify.com",
    "orders_requested": [299938, 280263, 220458], >>>>>> OPTIONAL
    "customer": {
      "id": 191167,
      "email": "john@email.com",
      "phone":  "555-625-1199"   >>>>>> OPTIONAL
    },
    "data_request": {
        "id": 9999
    }
  }
 */

router.post("/customers/data_request", webhook, (ctx) => {
  try {
    const data = ctx.request.body;
    console.log(
      `'/customers/data_request' Webhook received for shop: ${data.shop_domain}, customer: ${data.customer.id}`
    );
    ctx.status = 200;
    ctx.body = `'/customers/data_request' Webhook received for shop: ${data.shop_domain}, customer: ${data.customer.id}`;
  } catch (error) {
    console.log(
      `Failed to process webhook '/customers/data_request': ${error}`
    );
  }
});

/* Customers Redact */
// The shop owner's request to delete a customer's information or an order's information.
// This request will be sent after 10 days from the request period.
// Upon receipt of the webhook, the app should delete the customer’s personal information associated to that shop specifically.
// **Relevant only for apps that have access to customers scopes (READ_CUSTOMERS etc.) or orders scopes (READ_ORDERS etc.), otherwise respond with 200.
// Request body:
/* 
  {
    "shop_id": 954889,
    "shop_domain": "snowdevil.myshopify.com",
    "customer": {
      "id": 191167,
      "email": "john@email.com",
      "phone": "555-625-1199" // >>>>>> OPTIONAL
    },
    "orders_to_redact": [299938, 280263, 220458] >>>>>> OPTIONAL
  }

*/
router.post("/customers/redact", webhook, (ctx) => {
  try {
    const data = ctx.request.body;
    console.log(
      `'/customers/redact' Webhook received for shop: ${data.shop_domain}, customer: ${data.customer.id}`
    );
    ctx.status = 200;
    ctx.body = `'/customers/redact' Webhook received for shop: ${data.shop_domain}, customer: ${data.customer.id}`;
  } catch (error) {
    console.log(`Failed to process webhook '/customers/redact': ${error}`);
  }
});

/* Shop Redact */
// 48 hours after a shop uninstalls your app.
// Upon receipt of the webhook, the app must delete ALL CUSTOMERS’ personal information associated with that shop.
// **Relevant only for apps that have access to customers scopes (READ_CUSTOMERS etc.) or orders scopes (READ_ORDERS etc.), otherwise respond with 200.
// Request body:
/* 
  {
    "shop_id": 954889,
    "shop_domain": "snowdevil.myshopify.com"
  }
*/
router.post("/shop/redact", webhook, (ctx) => {
  try {
    const data = ctx.request.body;
    console.log(
      `'/shop/redact' Webhook received for shop: ${data.shop_domain}`
    );
    ctx.status = 200;
    ctx.body = `'/shop/redact' Webhook received for shop: ${data.shop_domain}`;
  } catch (error) {
    console.log(`Failed to process webhook '/shop/redact': ${error}`);
  }
});

export default router;
