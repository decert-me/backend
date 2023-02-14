const express = require("express");
// const { verifySignature } = require("../utils/sign");
const router = express.Router();
const { withSignature } = require("../middlewares/auth");
const { fail, succeed } = require("./base");
const func = require("../utils/func");
const db = require("../utils/db");
const BadgeService = require("../services/badge");
const Signer = require("../utils/signer");
const QuestService = require("../services/quest");


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
    let { tokenId, score } = req.body;
    const address = req.address;

    tokenId = Number(tokenId);
    if (!func.validateUInt(tokenId)) return fail(res, 'invalid tokenId');

    score = Number(score);
    if (!func.validateUInt(score)) return fail(res, 'invalid score');

    if (!address || !func.validateAddress(address)) return fail(res, 'invalid address');
    let permitSignature = await new Signer(process.env.SIGNER_PRIVATE_KEY).permitClaimBadge(address, [tokenId, score]);

    return succeed(res, { 'data': permitSignature });
});

router.post("/sumbitClaimTweet", withSignature, async (req, res) => {
    let { tokenId, tweetUrl } = req.body;
    const address = req.address;

    if (!tokenId || !func.validateUInt(Number(tokenId))) return fail(res, 'invalid params');
    if (!tweetUrl || !func.validateTweetFormat(tweetUrl)) return fail(res, 'invalid params');
    tweetUrl = tweetUrl.split('?')[0];

    // 检查tokenId是否存在以及可用
    const quest = await new QuestService().getAvailableQuest(tokenId);
    if (!quest) return fail(res, 'invalid quest');

    // 检查是否重复使用
    const claimBadgeTweet = await db.getOne('claim_badge_tweet', { 'url': tweetUrl });
    if (claimBadgeTweet) return fail(res, 'repeated tweet');

    // TODO: 检查用户是否已通过挑战，或已领取SBT

    // 验证推文内容
    let isCorrectTweet = await new BadgeService().sumbitClaimTweet(address, tokenId, tweetUrl);
    if (!isCorrectTweet) return fail(res, 'unmatch tweet');

    return succeed(res);
});

module.exports = router;
