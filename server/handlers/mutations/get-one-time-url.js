import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function ONETIME_CREATE(url) {
  return gql`
    mutation {
      appPurchaseOneTimeCreate(
        name: "test"
        price: { amount: 10, currencyCode: USD }
        returnUrl: "${url}"
        test: true
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appPurchaseOneTime {
          id
        }
      }
    }
  `;
}

export const getOneTimeUrl = async (ctx) => {
  const { client, shop, host } = ctx;
  const confirmationUrl = await client
    .mutate({
      // mutation: ONETIME_CREATE(process.env.HOST),
      mutation: ONETIME_CREATE(`${process.env.HOST}?shop=${shop}&host=${host}`),
    })
    .then((response) => response.data.appPurchaseOneTimeCreate.confirmationUrl);
  return ctx.redirect(confirmationUrl);
};
