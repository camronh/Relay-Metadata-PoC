const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const DynamoDB = require("./utils/DynamoDB");
app.use(cors());
app.use(bodyParser.json());

// POST Route to Create a New User
app.post("/createUser", async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      email: req.body.email,
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
app.get("/randomNumber", async (req, res) => {
  try {
    const ethAddress = req.header("sponsorAddress");
    const chainId = parseInt(req.header("chainId"));

    if (ethAddress) await DynamoDB.getUser(ethAddress);

    if (chainId == 1) throw "No requests on Mainnet.";

    const randomNumber = Math.floor(Math.random() * 100);
    res.status(200).send({ randomNumber });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

// const port = 3000;
// app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app; // add this line
