require("dotenv").config();
const Woocommerce = require("./utils/woocommerce");
const api = require("./utils/api");

// ===========================
// WHITELISTER
//
// Polls the Woocommerce API for new orders,
// and creates a new user in the database using their user data
// and includes their Eth Address that will be used for Authenticating
// their Airnode's relayed metadata.
// (https://docs.api3.org/airnode/v0.4/concepts/relay-meta-auth.html)
// 
// ===========================

async function main() {
  // Listen for new orders from Webstore http://13.233.252.69/
  const orders = await Woocommerce.listenForNewOrders();
  console.log(`Found ${orders.length} new order(s)!`);

  // For new each order found, try to create a user in the database
  for (let order of orders) {
    try {
      await api.createUser(order);
      await Woocommerce.markOrderComplete(order.id);
    } catch (error) {
      console.log(error);
      await Woocommerce.markOrderFailed(order.id);
    }
  }

  // Start loop over from the beginning
  main();
}

main();
