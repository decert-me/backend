const express = require("express");
const router = express.Router();
const { fail, succeed } = require("./base");
const func = require("../utils/func");
const BadgeService = require("../services/badge");


/**
 * share badge
 */
router.get("/badge/:tokenId", async (req, res) => {
    let { tokenId } = req.params;

    tokenId = Number(tokenId);

    let info = await new BadgeService().share(tokenId);

    return succeed(res, { 'data': info });
});


/**
 * share badge
 */
router.get("/badge/:tokenId/:userAddress", async (req, res) => {
    let { tokenId, userAddress } = req.params;
    if (!tokenId) return fail(res, 'invalid tokenId');
    if (userAddress && !func.validateAddress(userAddress)) return fail(res, 'invalid addressa');

    tokenId = Number(tokenId);

    let info = await new BadgeService().share(tokenId, userAddress);

    return succeed(res, { 'data': info });
});


module.exports = router;
