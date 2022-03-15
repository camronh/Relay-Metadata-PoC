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

// Polls the Woocommerce API for new orders
async function listenForNewOrders() {
  console.log(`Listening for new orders...`);

  return new Promise(async (resolve, reject) => {
    // Loop continuously until a new order is found
    while (true) {
      const { data: orders } = await WooCommerce.get("orders", {
        status: "processing,on-hold",
      });
      // If new orders are found, reformat, then return orders
      if (orders.length) {
        const parsedOrders = orders.map(parseOrder);
        return resolve(parsedOrders);
      }
      // Otherwise, sleep for a bit and try again
      else await sleep(sleepSeconds);
    }
  });
}

// Mark an order as completed in the WooCommerce Store
async function markOrderComplete(orderId) {
  const response = await WooCommerce.put(`orders/${orderId}`, {
    status: "completed",
  });

  if (response.status !== 200)
    throw `Failed to mark order ${orderId} completed`;

  console.log(`Marked order ${orderId} completed`);
}

// Mark an order as failed in the WooCommerce Store
async function markOrderFailed(orderId) {
  const response = await WooCommerce.put(`orders/${orderId}`, {
    status: "failed",
  });

  if (response.status !== 200) throw `Failed to mark order ${orderId} failed`;

  console.log(`Marked order ${orderId} failed`);
}

// Takes in Woocommerce order data and returns in a format that can be used to create a new user
function parseOrder(order) {
  return {
    name: order.billing.first_name + " " + order.billing.last_name,
    ethAddress: order.billing.ethaddress,
    email: order.billing.email,
    id: order.id,
  };
}

// Wait for a specified number of seconds
async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

module.exports = {
  listenForNewOrders,
  markOrderComplete,
  markOrderFailed,
};
