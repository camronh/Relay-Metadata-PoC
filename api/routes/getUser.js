const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/', async (req, res) => {
    try {
        const ethAddress = req.header('sponsorAddress');
        const chainId = req.header('chainId');
        const User = await Users.findOne({ethAddress: ethAddress});

        if (chainId == 1){
            res.status(500)
            res.json("Please select a different chainID");
        }
        else {

            if (ethAddress) {
                if (User) {
                    res.json(User);
                    console.log(User);
                }
                else if (User == null) {
                    res.json({message: "No User Found for that ETH Address"});
                    console.log("No User Found for that ETH Address");
                }
                res.json(User);
            }
            else if (!ethAddress) {
                res.status(500)
                res.json({message: "Please supply a valid ETH Address"});
                console.log("Please supply a valid ETH Address");
            }
    }
    } catch (err) {
        res.json({message: "Error in Getting User from DB"});
        console.log(err);
    }
});

module.exports = router;