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

// Polls the Woocommerce API for neqw orders
async function listenForNewOrders() {
  return new Promise(async (resolve, reject) => {
    // Loop continuously until a new order is found
    while (true) {
      const { data: orders } = await WooCommerce.get("orders", {
        status: "processing,on-hold",
      });
      // If new orders are found, return orders
      if (orders.length) resolve(orders);
      // Otherwise, sleep for a bit and try again
      else await sleep(sleepSeconds);
    }
  });
}

// Mark an order as completed in the WooCommerce Store
async function markComplete(orderId) {
  const response = await WooCommerce.put(`orders/${orderId}`, {
    status: "completed",
  });

  if (response.status !== 200)
    throw `Failed to mark order ${orderId} completed`;

  console.log(`Marked order ${orderId} completed`);
}

// Wait for a specified number of seconds
async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

module.exports = {
  listenForNewOrders,
  markComplete,
};
