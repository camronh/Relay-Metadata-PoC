require("dotenv").config();
const Woocommerce = require("./utils/woocommerce");
const api = require("./utils/api");

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
