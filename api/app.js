const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const DynamoDB = require("./utils/DynamoDB");
app.use(cors());

// POST Route to Create a New User
app.post("/createUser", async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      companyName: req.body.email,
    };
    const apiKey = req.header("x-api-key");

    if (apiKey != process.env.API_KEY) throw "Invalid API Credentials.";

    if (!user.name || !user.ethAddress || !user.email) {
      throw "Missing required parameters.";
    }

    const savedUser = await DynamoDB.saveUser(user);
    console.log("User saved!");
    res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

// GET Route to get a specific user from his ETH Address
app.get("/getUser", async (req, res) => {
  try {
    const apiKey = req.header("x-api-key");
    const ethAddress = req.header("sponsorAddress");
    const chainId = req.header("chainId");

    if (apiKey != process.env.API_KEY) throw "Invalid API Credentials.";

    if (parseInt(chainId) == 1) throw "No requests on Mainnet.";

    if (!ethAddress) throw "Please supply a valid ETH Address.";

    const User = await DynamoDB.getUser(ethAddress);
    if (!User) throw "No user found for that ETH address.";

    console.log(User);
    res.status(200).send(User); //successfully queried from DB
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

// const port = 3000;
// app.listen(port, () => console.log(`Listening on port ${port}`));


module.exports = app; // add this line
