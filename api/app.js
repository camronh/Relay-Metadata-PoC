const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const Users = require('./models/Users');
// Remove unused router
const router = express.Router();
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

        if (apiKey != process.env.API_KEY) {
            console.log("x-api-key authentication failed");
            //testing pull request change
            // Have the API return any errors thrown.
            // Ex. if (apiKey != process.env.API_KEY) throw "Incorrect x-api-key.";

            return res.json({message: "Incorrect x-api-key."});
        }
        if (chainId == 1) // throw "No Mainnet";
            return res.status(500).json({message: "Please select a different chainID"});


            // Still spaghetti code, but it works.
            // Replace with guard clauses.
            // throw if no eth address, throw if no user
            // Return user if all guard clauses pass. 
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
        // Have the API return any errors thrown.
        // ex. res.status(500).json({ message: err });

        // Allows 1 line guard clauses
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