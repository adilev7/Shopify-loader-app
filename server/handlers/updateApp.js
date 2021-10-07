const shopControl = require("../controllers/shop");
const gifControl = require("../controllers/gif");

export const updateApp = async (ctx) => {
  const { host, shop, accessToken } = ctx;
  const baseUrl = `https://${shop}/admin/api/2021-04`;

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

  /* ===== Upload app GIF to theme assets folder ===== */
  const createGif = async (mainTheme) => {
    try {
      const { active_gif: gifId } = await shopControl.getShop(shop);
      if (!gifId)
        throw new Error(`Failed to fetch active shop gif _id from DB`);

      const gif = await gifControl.getGif(gifId);
      const { file } = gif;
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
  if (host && shop && accessToken) {
    const mainTheme = await fetchMainTheme();
    createGif(mainTheme);
  }
};
