const axios = require("axios");

let usersApiUrl =
  "https://8p6v9cl5yc.execute-api.us-east-1.amazonaws.com/latest";
// usersApiUrl = "http://localhost:3000";

async function createUser(order) {
  const response = await axios.post(`${usersApiUrl}/createUser`, order, {
    headers: { "x-api-key": "242a5177-c719-4c47-bcb6-c673104ea25b" },
  });
  if (response.status !== 201) throw `Failed to create user`;
  else console.log(`Created user ${order.ethAddress}`);
}

module.exports = {
  createUser,
};
