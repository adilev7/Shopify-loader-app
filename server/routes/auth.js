const Router = require("koa-router");
const router = new Router({ prefix: "/auth" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

router.post("Create JWT token", "/", async (ctx) => {
  const shop = {
    shopUrl: ctx.shop,
    accessToken: await bcrypt.hash(ctx.accessToken, 10),
  };
  ctx.body = jwt.sign(shop, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
});
