const Router = require("koa-router");
const router = new Router({ prefix: "/gif" });
const gifControl = require("../controllers/gif");
const shopControl = require("../controllers/shop");

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shop: String
//   }

router.get("Get shop gifs", "/", async (ctx) => {
  try {
    // First get the currently active gif id
    const shop = await shopControl.getShop(ctx.query.shop);
    // get all gifs that are related to the shop + mark if chosen or not
    const gifs = await gifControl.getShopGifs(ctx.query.shop);
    if (!gifs) {
      throw new Error("Failed to get shop gifs");
    }
    gifs.map((gif) => {
      if (gif._id.equals(shop.active_gif)) {
        gif.chosen = true;
        return;
      }
      gif.chosen = false;
    });
    ctx.body = gifs;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
});
router.get("Get gif", "/:id", async (ctx) => {
  try {
    const gif = await gifControl.getGif(ctx.params.id);
    if (!gif) {
      throw new Error("Failed to get shop gifs");
    }
    ctx.body = gif;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
});
router.post("Create gif", "/", async (ctx) => {
  const gif = ctx.request.body;

  try {
    await gifControl.createGif(gif);
    await shopControl.updateShop({ shop: gif.shop, active_gif: gif._id });
    debugger;
  } catch (err) {
    console.log(err);
  }
});
// router.patch("Update gif", "/", async (ctx) => {
//   try {
//     const gifs = await gifControl.updateGifs(ctx.request.body);
//     ctx.body = gifs;
//     debugger;
//   } catch (err) {
//     console.log(err);
//     ctx.body = "Failed to update database";
//   }
// });
router.delete("Delete gif", "/:id", async (ctx) => {
  try {
    const gif = await gifControl.deleteGif(ctx.params.id);
    ctx.body = gif;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});

export default router;
