import "isomorphic-fetch";
import { gql } from "apollo-boost";
const shopControl = require("../controllers/shop");
const gifControl = require("../controllers/gif");

function INIT_APP() {
  return gql`
    mutation scriptTagCreate($input: ScriptTagInput!) {
      scriptTagCreate(input: $input) {
        scriptTag {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
}

export const initApp = async (ctx) => {
  const { host, client, shop, accessToken } = ctx;
  const baseUrl = `https://${shop}/admin/api/2021-04`;

  /* ===== Create scriptTag ===== */
  await client
    .mutate({
      mutation: INIT_APP(),
      variables: {
        input: {
          src: `https://${host}/script`,
          displayScope: "ALL",
        },
      },
    })
    .catch((err) => {
      throw new Error(`Failed to create initial scriptTag:  ${err}`);
    });

  /* ===== Fetch main theme ===== */
  const fetchMainTheme = async () => {
    try {
      const response = await fetch(`${baseUrl}/themes.json`, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      if (!response) throw new Error("Failed to fetch shop themes");

      const data = await response.json();
      const themes = data.themes.filter((theme) => theme.role === "main");

      if (!themes[0]) throw new Error("Failed to find main theme");

      return themes[0];
    } catch (err) {
      throw err;
    }
  };

  /* ===== Fetch theme.liquid file ===== */
  const fetchThemeLiquid = async (mainTheme) => {
    try {
      const response = await fetch(
        `${baseUrl}/themes/${mainTheme.id}/assets.json?asset[key]=layout/theme.liquid`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) throw new Error("Failed to fetch theme.liquid");

      const data = await response.json();
      return data.asset.value;
    } catch (err) {
      throw err;
    }
  };

  /* ===== Update theme.liquid file code ===== */
  const updateThemeLiquid = async (mainTheme, themeLiquid) => {
    /* ===== Prepare code for upload ===== */
    const loaderImg =
      "\n<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->\n" +
      `{% if content_for_header contains '${host}' %}\n` +
      "    {% render 'loadAroundApp' %}\n" +
      "{% endif %}\n\n";

    if (!themeLiquid.includes(loaderImg)) {
      const newThemeLiquid = themeLiquid.replace(
        "</body>",
        `${loaderImg}</body>`
      );

      try {
        await fetch(`${baseUrl}/themes/${mainTheme.id}/assets.json`, {
          method: "PUT",
          body: JSON.stringify({
            asset: {
              key: "layout/theme.liquid",
              value: newThemeLiquid,
            },
          }),

          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        });
        debugger;
      } catch (err) {
        throw new Error(`Failed to update 'theme.liquid':  ${err}`);
      }
    }
  };

  /* ===== Upload app GIF to theme assets folder ===== */
  const createGif = async (mainTheme) => {
    try {
      const { active_gif: gifId } = await shopControl.getShop(shop);
      if (!gifId)
        throw new Error(`Failed to fetch active shop gif _id from DB`);

      const { file } = await gifControl.getGif(gifId);
      if (!file)
        throw new Error(`Failed to fetch active shop gif file from DB`);

      // TODO - Check if uploaded files also need split ▼
      const activeGif = file.split("base64,")[1];
      debugger;

      await fetch(`${baseUrl}/themes/${mainTheme.id}/assets.json`, {
        method: "PUT",
        body: JSON.stringify({
          asset: {
            key: "assets/loader.gif",
            attachment: activeGif,
          },
        }),
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error(`Failed to create gif file:  ${err}`);
    }
  };

  /* ===== Upload app snippet file ===== */
  const createAppSnippet = async (mainTheme) => {
    const appSnippet =
      "<style>\n" +
      "    body {\n" +
      "        overflow: hidden;\n" +
      "    }\n" +
      "    .loadAroundApp {\n" +
      "        display: flex;\n" +
      "        position: absolute;\n" +
      "        top: 0;\n" +
      "        width: 100vw;\n" +
      "        height: 100vh;\n" +
      "        align-content: center;\n" +
      "        justify-content: center;\n" +
      "        z-index: 999;\n" +
      "        background-color: #ffffff;\n" +
      "    }\n" +
      "</style>\n\n" +
      "<div class='loadAroundApp'>\n" +
      "    {{ 'loader.gif' | asset_url | img_tag }}\n" +
      "</div>\n\n" +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>\n' +
      "<script>\n" +
      "    $(() => {\n" +
      "        setTimeout(() => {\n" +
      "            $('.loadAroundApp').fadeOut();\n" +
      "            $('body').css('overflow', 'auto');\n" +
      "        }, 1000);\n" +
      "    });\n" +
      "</script>";

    try {
      await fetch(`${baseUrl}/themes/${mainTheme.id}/assets.json`, {
        method: "PUT",
        body: JSON.stringify({
          asset: {
            key: "snippets/loadAroundApp.liquid",
            value: appSnippet,
          },
        }),
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error(`Failed to create app snippet file:  ${err}`);
    }
  };

  const mainTheme = await fetchMainTheme();
  const themeLiquid = await fetchThemeLiquid(mainTheme);
  updateThemeLiquid(mainTheme, themeLiquid);
  createGif(mainTheme);
  createAppSnippet(mainTheme);
};
