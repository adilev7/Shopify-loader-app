const Router = require("koa-router");
const router = new Router({ prefix: "/gif" });
const gifControl = require("../controllers/gif");

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shop: String
//   }

// router.get("Get all gifs", "/", async (ctx) => {
//   try {
//     const gifs = await gifControl.getAllGifs();
//     ctx.body = gifs;
//   } catch (err) {
//     console.log(err);
//     ctx.body = "Failed to update database";
//   }
// });
router.get("Get gif", "/", async (ctx) => {
  console.log({ "gif route": ctx.query.shop });
  try {
    const gif = await gifControl.getShopGifs(ctx.query.shop);
    console.log({ gif });
    ctx.body = gif;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});
router.post("Create gif", "/", async (ctx) => {
  try {
    const gif = await gifControl.createGif(ctx.body);
    ctx.body = gif;
  } catch (err) {
    console.log(err);
    ctx.body = "Failed to update database";
  }
});
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
