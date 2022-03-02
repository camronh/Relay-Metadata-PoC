const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/', async (req, res) => {
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

module.exports = router;