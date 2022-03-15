require("dotenv").config();

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const { consumerKey, consumerSecret } = process.env;

const sleepSeconds = 10;

const WooCommerce = new WooCommerceRestApi({
  url: "http://13.233.252.69",
  consumerKey,
  consumerSecret,
  version: "wc/v3",
});

async function whitelist(ethAddress) {
  console.log(`Whitelisting: ${ethAddress}`);
  return new Promise((resolve, reject) => {
    // TODO: WHITELIST
  
  });
}

async function markComplete(orderId) {
  if (!orderId) throw "No order ID";
  const response = await WooCommerce.put(`orders/${orderId}`, {
    status: "completed",
  });
  if (response.status !== 200)
    throw `Failed to mark order ${orderId} completed`;

  console.log(`Marked order ${orderId} completed`);
}

async function main() {
  const { data: orders } = await WooCommerce.get("orders", {
    status: "processing,on-hold",
  });
  if (orders.length) console.log(`Found ${orders.length} orders`);
  for (let order of orders) {
    try {
      await whitelist(order.billing.ethaddress);
      await markComplete(order.id);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log(`Done, sleeping for ${sleepSeconds} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, sleepSeconds * 1000));
  main();
}

console.log("Listening for new orders...\n\n");
main();
