export const initApp = async (shop, accessToken) => {
  let mainTheme, themeLiquid;
  /* ===== Get main theme ===== */
  console.log({ accessToken });
  await fetch(`https://${shop}/admin/api/2021-04/themes.json`, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log({ res1: res, msg1: "Themes found." });
      return res.json();
    })
    .then((data) => {
      console.log({ data });
      const themes = data.themes.filter((theme) => theme.role === "main");
      console.log({ role1: themes[0].role, id1: themes[0].id });
      mainTheme = themes[0];
    })
    .catch((error) => console.log({ Error1: error }));
  // console.log({ role2: mainTheme.role, id2: mainTheme.id });

  /* ===== Get theme.liquid file ===== */
  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json?asset[key]=layout/theme.liquid`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ res4: res });
      return res.json();
    })
    .then((data) => {
      console.log({ msg4: "theme.liquid found." });
      themeLiquid = data.asset.value;
    })
    .catch((err) => console.log({ Error4: err }));

  /* ===== Prepare app strings for upload ===== */
  // const host = process.env.HOST.split("://")[1];
  const cssJs =
    "\n<!--~~~~~~~~~~ Loader app CSS - Look Around Apps ~~~~~~~~~~-->\n" +
    "{{ 'loader.css' | asset_url | stylesheet_tag }}\n" +
    "\n<!--~~~~~~~~~~ Loader app JS - Look Around Apps ~~~~~~~~~~-->\n" +
    "<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js' integrity='sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==' crossorigin='anonymous' referrerpolicy='no-referrer'></script>\n" +
    "{{ 'loader.js' | asset_url | script_tag }}\n\n";
  const loaderImg =
    "\n<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->\n" +
    // If app relies on scriptTag (recommended):
    // `{% if content_for_header contains '${host}' %}\n` +
    "{% render 'loadAroundApp' %}\n\n";
  // "{% endif %}\n" +
  // `<script src="${process.env.HOST}/script-tag.js"></script>\n` +
  if (!themeLiquid.includes(loaderImg) || !themeLiquid.includes(cssJs)) {
    themeLiquid = themeLiquid.replace("<script>", `${cssJs}<script>`);
    themeLiquid = themeLiquid.replace("</body>", `${loaderImg}</body>`);
  }

  /* ===== Update theme.liquid file with app strings ===== */
  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "layout/theme.liquid",
          value: themeLiquid,
        },
      }),

      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ res4: res });
      return res.json();
    })
    .then((data) => {
      console.log({ data4: data, msg4: "theme.liquid Updated successfully!" });
      return data;
    })
    .catch((err) => console.log({ Error4: err }));

  /* ===== Upload app GIF to theme assets folder ===== */
  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "assets/loader.gif",
          src:
            "https://flevix.com/wp-content/uploads/2020/01/Loading-Image.gif",
        },
      }),
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ resGIF: res });
      return res.json();
    })
    .then((data) => {
      console.log({
        dataGIF: data,
        msgGIF: "Gif uploaded successfully to assets!",
      });
    })
    .catch((err) => console.log({ ErrorGIF: err }));

  /* ===== Upload app liquid snippet ===== */
  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "snippets/loadAroundApp.liquid",
          value:
            "   <div class='loadAroundApp'>\n" +
            "       {{ 'loader.gif' | asset_url | img_tag }}\n" +
            "   </div>\n\n",
        },
      }),
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ res2: res });
      return res.json();
    })
    .then((data) => {
      console.log({
        dataSnip: data,
        msgSnip: "Snippet uploaded successfully!",
      });
    })
    .catch((err) => console.log({ ErrorSnip: err }));

  /* ===== Upload app JS to theme assets folder ===== */
  const appJS =
    "$(() => {\n" +
    "    setTimeout(() => {\n" +
    "        $('.loadAroundApp').fadeOut();\n" +
    "        $('body').css('overflow', 'auto');\n" +
    "    }, 1000);\n" +
    "});";

  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "assets/loader.js",
          value: appJS,
        },
      }),
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ res2: res });
      return res.text();
    })
    .then((data) => {
      console.log({
        dataJS: data,
        msgJS: "JS uploaded successfully to assets!",
      });
    })
    .catch((err) => console.log({ ErrorJS: err }));

  /* ===== Upload app CSS ===== */
  const appCSS =
    "body {\n" +
    "    overflow: hidden;\n" +
    "}\n" +
    ".loadAroundApp {\n" +
    "    display: flex;\n" +
    "    position: absolute;\n" +
    "    top: 0;\n" +
    "    width: 100vw;\n" +
    "    height: 100vh;\n" +
    "    align-content: center;\n" +
    "    justify-content: center;\n" +
    "    z-index: 999;\n" +
    "    background-color: #ffffff;\n" +
    "}";
  await fetch(
    `https://${shop}/admin/api/2021-04/themes/${mainTheme.id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify({
        asset: {
          key: "assets/loader.css",
          value: appCSS,
        },
      }),
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log({ res2: res });
      return res.text();
    })
    .then((data) => {
      console.log({
        dataCSS: data,
        msgCSS: "CSS uploaded successfully to assets!",
      });
    })
    .catch((err) => console.log({ ErrorCSS: err }));

  // Create script tag
  // await fetch(`https://${shop}/admin/api/2021-04/script_tags.json`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     script_tag: {
  //       event: "onload",
  //       src: `${process.env.HOST}/script-tag.js`,
  //     },
  //   }),

  //   headers: {
  //     "X-Shopify-Access-Token": accessToken,
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => {
  //     console.log({ res3: res });
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log({ data3: data, msg: "scriptTag created successfully!" });
  //   })
  //   .catch((err) => console.log({ Error3: err }));
};
