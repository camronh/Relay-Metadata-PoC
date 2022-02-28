const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.post('/', async (req, res) => {
    const user = new Users({
        name: req.body.name,
        ethAddress: req.body.ethAddress,
        companyName: req.body.companyName
    });
    try{
    const savedUser = await user.save();
        res.json(savedUser);
        console.log("User Added!");
        }catch(err){
            res.json({message: err});
        }
});

module.exports = router;