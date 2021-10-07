import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { getBillingStatus } from "./queries/get-billing-status";
const shopControl = require("../controllers/shop");
const gifControl = require("../controllers/gif");

function CREATE_SCRIPT_TAG() {
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
      mutation: CREATE_SCRIPT_TAG(),
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
    let newThemeLiquid = themeLiquid.slice();
    const loaderImg =
      "\n\n<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->\n" +
      `{% if content_for_header contains '${host}' %}\n` +
      "    {% render 'loadAroundApp' %}\n" +
      "{% endif %}" +
      "\n<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->\n\n";

    if (
      newThemeLiquid.includes(
        "<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->"
      )
    ) {
      newThemeLiquid = newThemeLiquid.split(
        "<!--~~~~~~~~~~ Loader app GIF - Look Around Apps ~~~~~~~~~~-->"
      );
      newThemeLiquid = newThemeLiquid[0] + newThemeLiquid[2];
    }

    if (!newThemeLiquid.includes(loaderImg)) {
      newThemeLiquid = newThemeLiquid.replace("</body>", `${loaderImg}</body>`);

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

      const activeGif = file.split("base64,")[1];

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
      "    .loadAroundApp {\n" +
      "        position: fixed;\n" +
      "        top: 0;\n" +
      "        left: 0;\n" +
      "        z-index: 999;\n" +
      "        display: flex;\n" +
      "        flex-direction: column;\n" +
      "        align-items: center;\n" +
      "        justify-content: center;\n" +
      "        width: 100%;\n" +
      "        height: 100%;\n" +
      "        background-color: #FFFFFF;\n" +
      "        transition: all 0.3s ease-in-out;\n" +
      "    }\n" +
      "    .loadAroundApp > * {\n" +
      "        max-width: 150px;\n" +
      "    }\n" +
      "</style>\n\n" +
      "<div class='loadAroundApp'>\n" +
      "    {{ 'loader.gif' | asset_url | img_tag }}\n" +
      "</div>\n\n" +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>\n' +
      "<script>\n" +
      "    $(() => {\n" +
      "        setTimeout(() => {\n" +
      "            $('.loadAroundApp').css('opacity', 0);\n" +
      "        }, 1000);\n" +
      "        setTimeout(() => {\n" +
      "            $('.loadAroundApp').hide();\n" +
      "        }, 1300);\n" +
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

  if (host && client && shop && accessToken) {
    try {
      const mainTheme = await fetchMainTheme();
      const themeLiquid = await fetchThemeLiquid(mainTheme);
      updateThemeLiquid(mainTheme, themeLiquid);
      createGif(mainTheme);
      createAppSnippet(mainTheme);
      shopControl.updateInitStatus(shop, true);
    } catch (err) {
      throw err;
    }
  }
};
