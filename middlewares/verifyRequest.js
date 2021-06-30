const jwt = require("jsonwebtoken");

export default verifyRequest = async (ctx, next) => {
  const authHeader = ctx.request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return ctx.response.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, shop) => {
    console.log(err);

    if (err) return ctx.response.sendStatus(403);

    ctx.request.shop = shop;

    next();
  });
};
