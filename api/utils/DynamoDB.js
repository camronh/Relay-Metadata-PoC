let AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

const subscriptionTimeInMinutes = 1;

async function saveUser(user) {
  return new Promise((resolve, reject) => {
    console.log("Saving User...");

    user.expiration = getTTL(subscriptionTimeInMinutes);

    const params = {
      TableName: "RelayMetadata-PoC-Users",
      Item: {
        ...user,
      },
    };
    docClient.put(params, async function (err, data) {
      if (err) {
        reject("Unable save User! Error: " + JSON.stringify(err, null, 2));
      } else {
        console.log(`User ${user.email} saved in DB`);
        resolve(user);
      }
    });
  });
}

// saveUser({
//   ethAddress: "0x0000000000000000000000000000000000000000",
//   email: "camr",
//   name: "Camilo",
// });

async function getUser(ethAddress) {
  return new Promise((resolve, reject) => {
    console.log(`Getting User with address: ${ethAddress}`);
    const params = {
      TableName: "RelayMetadata-PoC-Users",
      Key: {
        ethAddress,
      },
    };

    docClient.get(params, function (err, data) {
      if (err) return reject(err);
      if (!data.Item) return reject("Address not found!");
      console.log("Address found!");
      resolve(data.Item);
    });
  });
}

// getUser("0x0000000000000000000000000000000000000000").then(console.log);

function getTTL(TTL) {
  return parseInt(Date.now() / 1000 + TTL * 60);
}

module.exports = {
  saveUser,
  getUser,
};
