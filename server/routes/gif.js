const Router = require("koa-router");
const router = new Router({ prefix: "/gif" });
const gifControl = require("../controllers/gif");
const shopControl = require("../controllers/shop");
import verifyToken from "../middlewares/verifyToken";

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shop: String
//   }

router.get("Get shop gifs", "/", verifyToken, async (ctx) => {
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
router.get("Get gif", "/:id", verifyToken, async (ctx) => {
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
router.post("Create gif", "/", verifyToken, async (ctx) => {
  const gif = ctx.request.body;

  try {
    await gifControl.createGif(gif);
    // await shopControl.updateActiveGif({ shop: gif.shop, active_gif: gif._id });
  } catch (err) {
    console.log(err);
  }
});
// router.patch("Update gif", "/", async (ctx) => {
//   try {
//     const gifs = await gifControl.updateGifs(ctx.request.body);
//     ctx.body = gifs;
//   } catch (err) {
//     console.log(err);
//     ctx.body = "Failed to update database";
//   }
// });
router.delete("Delete gif", "/:id", verifyToken, async (ctx) => {
  try {
    const gif = await gifControl.deleteGif(ctx.params.id);
    ctx.body = gif;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});

export default router;
