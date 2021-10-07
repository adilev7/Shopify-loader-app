import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function GET_ACTIVE_SUBSCRIPTIONS() {
  return gql`
    {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          test
          status
          lineItems {
            id
          }
          currentPeriodEnd
          createdAt
        }
      }
    }
  `;
}

/* ===== Check billing ===== */
// try {
//     const billingStatus = await getBillingStatus(ctx);
//     if (!(billingStatus === "ACTIVE" || billingStatus === "ACCEPTED")) {
//       throw new Error(
//         "Billing plan was not accepted by client or was not activated"
//       );
//     }
//   } catch (err) {
//     throw new Error(`Failed to create billing plan: ${err}`);
//   }

export const getBillingStatus = async (ctx) => {
  const { client } = ctx;
  const { data } = await client.query({
    // mutation: RECURRING_CREATE(process.env.HOST),
    query: GET_ACTIVE_SUBSCRIPTIONS(),
  });
  return data.currentAppInstallation.activeSubscriptions[0]?.status;
};
