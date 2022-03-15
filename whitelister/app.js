require("dotenv").config();
const Woocommerce = require("./utils/woocommerce");

async function createUser(ethAddress) {
  console.log(`Whitelisting: ${ethAddress}`);
  return new Promise((resolve, reject) => {
    // TODO: WHITELIST
  });
}

async function main() {
  // Listen for new orders from Webstore http://13.233.252.69/
  const orders = await Woocommerce.listenForNewOrders();
  console.log(`Found ${orders.length} new order(s)!`);

  // For new each order found, create a user in the database
  for (let order of orders) {
    try {
      await createUser(order.billing.ethaddress);
      await Woocommerce.markComplete(order.id);
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
