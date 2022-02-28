const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/', async (req, res) => {
    try {
        const ethAddress = req.query.ethAddress;
        const User = await Users.findOne({ethAddress: ethAddress});
        res.json(User);
        console.log("User with ETH Address Found in DB");
        console.log(User);
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;