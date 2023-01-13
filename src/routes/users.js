const express = require("express");
const db = require("../utils/db");
const { withAddress, withSignature } = require("../middlewares/auth");
const router = express.Router();
const { fail, succeed } = require("./base");
const UserService = require("../services/user");
const func = require("../utils/func");


router.get("/discord", withSignature, async (req, res) => {
  const address = req.address;

  if (!address || !func.validateAddress(address)) return fail(res, 'Invalid address');

  let info = await new UserService(address).getDiscordInfo();

  return succeed(res, { 'data': info });
});

router.get("/:address", async (req, res) => {
  const address = req.params.address;

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  res.status(200).send(user.data);
});

router.get("/", async (req, res) => {
  const address = req.query.address;

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  return succeed(res, { 'data': user.data });
});

router.get("/auth/info", withAddress, async (req, res) => {
  const address = req.address;

  const user = await db.findUserByAddress(address);
  if (!user.exists) {
    res.status(404).send("User doesn't exist");
    return;
  }

  let authInfo = await new UserService(address).getAuthInfo();

  authInfo = _formatAuthInfo(authInfo);

  return succeed(res, { 'data': authInfo });
});


function _formatAuthInfo(authInfo) {
  return authInfo;
}


module.exports = router;