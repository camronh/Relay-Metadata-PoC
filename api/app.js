const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const Users = require('./models/Users');
const router = express.Router();
// const API_KEY = "XdONGxOjq82pZrewrlUM";


app.use(bodyParser.json());

//ROUTES

// POST Route to create a new user
app.post("/createUser", async (req, res) => {
    const user = new Users({
      name: req.body.name,
      ethAddress: req.body.ethAddress,
      companyName: req.body.companyName,
    });
    if (!user.name || !user.ethAddress || !user.companyName) {
        return res.status(400).json({ message: "Please supply a valid name, ethAddress, and companyName" });
    }
    try {
      const savedUser = await user.save();
      console.log("User Added!");
      return res.json(savedUser);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  });


// GET Route to get a specific user from his ETH Address
app.get('/getUser', async (req, res) => {
    try {
        const ethAddress = req.header('sponsorAddress');
        const chainId = req.header('chainId');
        const User = await Users.findOne({ ethAddress });

        if (chainId == 1)
            return res.status(500).json({message: "Please select a different chainID"});

            if (ethAddress) {
                if (User) {
                    console.log(User);
                    return res.json(User);
                }
                else if (!User) {
                    console.log("No User Found for that ETH Address");
                    return res.json({message: "No User Found for that ETH Address"});
                }
                // res.json(User);
            }
            else if (!ethAddress) {
                console.log("Please supply a valid ETH Address");
                return res.status(500).json({message: "Please supply a valid ETH Address"});
            }
    
    } catch (err) {
        console.log(err);
        return res.json({message: "Error in Getting User from DB"});
    }
});
    //Connect to DB
    mongoose.connect(process.env.DB_CONNECT, () => {
        console.log('Connected to DB');
    });

app.listen(3000);