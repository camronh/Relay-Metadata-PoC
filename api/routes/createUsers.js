const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.post('/', (req, res) => {
    const user = new Users({
        name: req.body.name,
        ethAddress: req.body.ethAddress
    });

    user.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });
});

module.exports = router;