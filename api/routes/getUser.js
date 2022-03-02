const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/', async (req, res) => {
    try {
        const ethAddress = req.query.ethAddress;
        // Error handling for missing ethAddress
        // if (no address) return error
        const User = await Users.findOne({ethAddress: ethAddress});
        // if (no user) return declined
        // 
        // Same applies to createUsers.js
        res.json(User);
        console.log("User with ETH Address Found in DB");
        console.log(User);
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;