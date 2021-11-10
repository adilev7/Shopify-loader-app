const Router = require("koa-router");
const router = new Router({ prefix: "/shop" });
const shopControl = require("../controllers/shop");
import { updateApp } from "../handlers";
import verifyToken from "../middlewares/verifyToken";

/* Shop Schema */
//   {
//       _id: String,
//      shopUrl: String,
//      accessToken: String
//   }

router.get("Get all shops", "/", verifyToken, async (ctx) => {
  try {
    const shops = await shopControl.getAllShops();
    ctx.body = shops;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});
router.get("Get shop", "/", verifyToken, async (ctx) => {
  try {
    const shop = await shopControl.getShop(ctx.query.shop);
    ctx.body = shop;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});

router.post("Create shop", "/", verifyToken, async (ctx) => {
  try {
    const shop = await shopControl.createShop(ctx.request.body);
    ctx.body = shop;
  } catch (err) {
    console.error(err);
    ctx.body = "Failed to update database";
  }
});
router.patch("Update shop active gif", "/", verifyToken, async (ctx) => {
  try {
    const shop = await shopControl.updateActiveGif(ctx);
    await updateApp(ctx);
    ctx.body = shop;
  } catch (err) {
    console.error(err);
    ctx.body = "Failed to update database";
  }
});
router.patch("Update shop init status", "/init", verifyToken, async (ctx) => {
  try {
    ctx.body = await shopControl.updateInitStatus(ctx);
  } catch (err) {
    console.error(err);
    ctx.body = "Failed to update database";
  }
});
router.delete("Delete shop", "/:id", verifyToken, async (ctx) => {
  try {
    const shop = await shopControl.deleteShop(ctx.params.id);
    ctx.body = shop;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});

export default router;
