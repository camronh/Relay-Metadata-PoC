const axios = require("axios");

let usersApiUrl = "http://localhost:3000";

async function createUser(order) {
  const response = await axios.post(`${usersApiUrl}/users`, order);
  if (response.status !== 200) throw `Failed to create user`;
  else console.log(`Created user ${order.ethAddress}`);
}

module.exports = {
  createUser,
};
