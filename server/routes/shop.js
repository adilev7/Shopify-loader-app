const Router = require("koa-router");
const router = new Router({ prefix: "/shop" });
const shopControl = require("../controllers/shop");

/* Shop Schema */
//   {
//       _id: String,
//      shopUrl: String,
//      accessToken: String
//   }

router.get("Get all shops", "/", async (ctx) => {
  try {
    const shops = await shopControl.getAllShops();
    ctx.body = shops;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});
router.get("Get shop", "/:id", async (ctx) => {
  try {
    const shop = await shopControl.getShop(ctx.params.id);
    debugger;
    ctx.body = shop;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});
router.post("Create shop", "/", async (ctx) => {
  try {
    const shop = await shopControl.createShop(ctx.request.body);
    ctx.body = shop;
  } catch (err) {
    console.error(err);
    ctx.body = "Failed to update database";
  }
});
router.patch("Update shop", "/", async (ctx) => {
  try {
    const shop = await shopControl.updateShop(ctx.request.body);
    ctx.body = shop;
  } catch (err) {
    console.error(err);
    ctx.body = "Failed to update database";
  }
});
router.delete("Delete shop", "/:id", async (ctx) => {
  try {
    const shop = await shopControl.deleteShop(ctx.params.id);
    ctx.body = shop;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});

export default router;
