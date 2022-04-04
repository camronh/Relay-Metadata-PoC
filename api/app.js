const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const DynamoDB = require("./utils/DynamoDB");
app.use(cors());
app.use(bodyParser.json());

/*
Create a new User in the database from Webstore order data.

  POST /createUser
  {
    "name": "John Doe",
    "ethAddress": "0x1234567890123456789012345678901234567890",
    "email": "John@email.com"
  }

  Headers: x-api-key: <API_KEY>

*/
app.post("/createUser", async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      email: req.body.email,
    };

    // Validate API Key
    const apiKey = req.header("x-api-key");
    if (apiKey != process.env.API_KEY) throw "Invalid API Credentials.";

    // Validate required parameters
    if (!user.name || !user.ethAddress || !user.email) {
      throw "Missing required parameters.";
    }

    const savedUser = await DynamoDB.saveUser(user); // Store user in Database
    res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

/* 

  Get a Random Number

  GET /randomNumber
  Query Params: none
  
  Headers (Automatically relayed by Airnode): 
  sponsorAddress: <ETH_ADDRESS>, chainId: <CHAIN_ID> 

*/
app.get("/randomNumber", async (req, res) => {
  try {
    const ethAddress = req.header("sponsorAddress");
    const chainId = parseInt(req.header("chainId"));

    if (ethAddress) await DynamoDB.getUser(ethAddress); // If request is from the blockchain, check if user exists in DB

    if (chainId == 1) throw "No requests on Mainnet."; // Block/Allow request from certain blockchains

    const randomNumber = Math.floor(Math.random() * 100); // Generate random number
    res.status(200).send({ randomNumber });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

module.exports = app; // add this line
