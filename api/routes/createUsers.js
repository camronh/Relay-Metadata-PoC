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

module.exports = router;
