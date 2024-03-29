import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(url) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Normal Plan"
          returnUrl: "${url}"
          test: true
          lineItems: [
         # {
         #   plan: {
         #     appUsagePricingDetails: {
         #         cappedAmount: { amount: 3, currencyCode: USD }
         #         terms: ""
         #     }
         #   }
         # }
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 3, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx) => {
  const { client, shop, queryHost: host } = ctx;
  try {
    const confirmationUrl = await client
      .mutate({
        // mutation: RECURRING_CREATE(process.env.HOST),
        mutation: RECURRING_CREATE(
          `${process.env.HOST}?shop=${shop}&host=${host}`
        ),
      })
      .then((response) => {
        return response.data.appSubscriptionCreate.confirmationUrl;
      });
    return confirmationUrl;
  } catch (err) {
    console.error(err);
  }
  // ctx.set("Access-Control-Allow-Origin", "*");
};
