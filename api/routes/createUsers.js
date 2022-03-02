const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

router.post("/", async (req, res) => {
  const user = new Users({
    name: req.body.name,
    ethAddress: req.body.ethAddress,
    companyName: req.body.companyName,
  });
  if (!user.name || !user.ethAddress || !user.companyName) {
      res.status(400)
    res.json({ message: "Please supply a valid name, ethAddress, and companyName" });
  }
  try {
    const savedUser = await user.save();
    res.json(savedUser);
    console.log("User Added!");
  } catch (err) {
    res.status(500)
    res.json({ message: err });
  }
});

module.exports = router;
