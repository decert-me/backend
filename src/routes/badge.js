const express = require("express");
// const { verifySignature } = require("../utils/sign");
const router = express.Router();
const { withSignature } = require("../middlewares/auth");
const { fail, succeed } = require("./base");
const func = require("../utils/func");
const BadgeService = require("../services/badge");
const Signer = require("../utils/signer");


/**
 * share
 */
router.get("/share/:tokenId", async (req, res) => {
    let { tokenId } = req.params;

    tokenId = Number(tokenId);

    let info = await new BadgeService().share(tokenId);

    return succeed(res, { 'data': info });
});


/**
 * share
 */
router.get("/share/:tokenId/:userAddress", async (req, res) => {
    let { tokenId, userAddress } = req.params;
    if (!tokenId) return fail(res, 'invalid tokenId');
    if (userAddress && !func.validateAddress(userAddress)) return fail(res, 'invalid addressa');

    tokenId = Number(tokenId);

    let info = await new BadgeService().share(tokenId, userAddress);

    return succeed(res, { 'data': info });
});

/**
 * claim Badge NFT
 */
router.post("/claim", withSignature, async (req, res) => {
    let { tokenId } = req.body;
    const address = req.address;

    tokenId = Number(tokenId);
    if (!func.validateUInt(tokenId)) return fail(res, 'invalid tokenId');

    if (!address && !func.validateAddress(address)) return fail(res, 'invalid addressa');

    let permitSignature = await new Signer(process.env.SIGNER_PRIVATE_KEY).permitClaimBadge(address, tokenId);
    return succeed(res, { 'data': permitSignature });
});

module.exports = router;
