const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const Users = require('./models/Users');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

// POST Route to Create a New User
app.post("/createUser", async (req, res) => {
    try {
    const user = new Users({
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      companyName: req.body.companyName,
    });
    const apiKey = req.header("x-api-key");

    if (apiKey != process.env.API_KEY) throw "Incorrect x-api-key. Authentication failed.";

    if (!user.name || !user.ethAddress || !user.companyName) throw "Please supply a valid name, ethAddress, and companyName.";

        else {
            try{
            const savedUser = await user.save();
            console.log("User Added!");
            return res.json(savedUser);
            }
            catch (err) {
                console.log("A User with that ETH Address already exists!");
                return res.status(400).json({ message: "A User with that ETH Address already exists!" });
            }
        }
    }   catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
    }
  });


// GET Route to get a specific user from his ETH Address
app.get('/getUser', async (req, res) => {
    try {
        const apiKey = req.header("x-api-key");
        const ethAddress = req.header('sponsorAddress');
        const chainId = req.header('chainId');
        const User = await Users.findOne({ ethAddress });

        if (apiKey != process.env.API_KEY) throw "Incorrect x-api-key. Authentication failed.";

        if (chainId == 1) throw "No requests on Mainnet. Please select a different chainID";

        if (!ethAddress) throw "Please supply a valid ETH Address."

        if (!User) throw "No user found for that ETH address.";

            else {
                console.log(User);
                return res.json(User);
            }
    
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
    }
});

    mongoose.connect(process.env.DB_CONNECT, () => {
        console.log('API listening on port 3000');
    });

app.listen(3000);