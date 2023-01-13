const express = require("express");
const db = require("../utils/db");
const { withAddress } = require("../middlewares/auth");
const router = express.Router();
const { fail, succeed } = require("./base");


router.post("/auth/twitter", withAddress, async (req, res) => {
  const address = req.address;

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  const authLink = await twitterService.bindUser(address);

  return succeed(res, { 'data': authLink });
});

router.get("/callback/twitter", withAddress, async (req, res) => {
  const address = req.address;
  let { state,  code} = req.params;

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  const authLink = await twitterService.bindUser(address);

  return succeed(res, { 'data': authLink });
});


module.exports = router;