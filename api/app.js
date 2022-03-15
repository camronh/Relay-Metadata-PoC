const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const Users = require('./models/Users');
// const API_KEY = "XdONGxOjq82pZrewrlUM";
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

//ROUTES

// POST Route to create a new user
app.post("/createUser", async (req, res) => {
    const user = new Users({
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      companyName: req.body.companyName,
    });
    const apiKey = req.header("x-api-key"); //gives you the value of the header
    if (apiKey != process.env.API_KEY) {
        console.log("x-api-key authentication failed");
        return res.json({message: "Incorrect x-api-key."});
        }
    if (!user.name || !user.ethAddress || !user.companyName) {
        return res.status(400).json({ message: "Please supply a valid name, ethAddress, and companyName" });
    }
    try {
      const savedUser = await user.save();
      console.log("User Added!");
      return res.json(savedUser);
    } catch (err) {
      return res.status(500).json({ message: "A User with that ETH Address already exists" });
    }
  });


// GET Route to get a specific user from his ETH Address
app.get('/getUser', async (req, res) => {
    try {
        const apiKey = req.header("x-api-key"); //gives you the value of the header
        const ethAddress = req.header('sponsorAddress');
        const chainId = req.header('chainId');
        const User = await Users.findOne({ ethAddress });

        if (apiKey != process.env.API_KEY) throw "Incorrect x-api-key. Authentication failed.";

        if (chainId == 1) throw "No Mainnet. Please select a different chainID";

        if (!ethAddress) throw "Please supply a valid ETH Address."

        if (!User) throw "No user found for that ETH address.";
            //return User after all guard clauses passed
            else {
                console.log(User);
                return res.json(User);
            }
    
    } catch (err) { // Have the API return any errors thrown.
        res.status(500).json({ message: err });
        // if (bug) throw "Bug found";
        console.log(err);
        return res.json({message: "Error in Getting User from DB"});
    }
});
    //Connect to DB
    mongoose.connect(process.env.DB_CONNECT, () => {
        console.log('Connected to DB');
    });

app.listen(3000);