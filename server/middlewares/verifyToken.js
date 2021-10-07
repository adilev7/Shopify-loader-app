const shopControl = require("../controllers/shop");

export const verifyToken = async (ctx, next) => {
  const shop = ctx.query.shop;
  if (!shop) {
    return ctx.throw(400, "Bad Request");
  }
  const data = await shopControl.getShop(shop);
  debugger;
  if (!data) {
    // return ctx.throw(403, "Not authorized");
    return ctx.redirect(`/auth?shop=${shop}`);
  }
  ctx.shop = shop;
  ctx.accessToken = data.accessToken;
  return next();
};

export default verifyToken;
