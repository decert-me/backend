const express = require("express");
const db = require("../utils/db");
const { verifySignature } = require("../utils/sign");
const { withSignature } = require("../middlewares/auth");
const router = express.Router();
const Signer = require("../utils/signer");
const IpfsClient = require("../utils/customIpfsClient");
const QuestService = require("../services/quest");
const { fail, succeed } = require("./base");
const ipfsClient = new IpfsClient();


/**
 * Get all Quests.
 */
router.get("/", async (req, res) => {
  const { isDraft = false, type } = req.query;

  let where = { 'disabled': false };
  where.isDraft = Boolean(isDraft);
  if (type != undefined) where.type = type;

  const allQuests = await db.findQuests(where);

  let quests = allQuests.map(ele => formatQuest(ele));
  // let resp = {
  //   code: 0,
  //   msg: 'OK',
  //   data: quests,
  // }
  let resp = quests;
  res.json(resp);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // const dbQuest = await _getQuestById(id);
  const dbQuest = await db.getOne('quest', { 'tokenId': id });

  let quest = formatQuest(dbQuest);
  // let resp = {
  //   code: 0,
  //   msg: 'OK',
  //   data: quest,
  // }
  let resp = quest;
  res.json(resp);
});

async function _getQuestById(id) {
  if (!id) return null;

  return (await db.findQuestById(id)) || null;
}

function formatQuest(dbQuest) {
  if (!dbQuest) return null;

  return {
    "id": dbQuest.id,
    "title": dbQuest.title,
    "description": dbQuest.description || '',
    "addTs": dbQuest.addTs || 0,
    "type": dbQuest.type,
    "creator": dbQuest.creator,
    "tokenId": dbQuest.tokenId === null ? null : Number(dbQuest.tokenId),
    'uri': dbQuest.uri,
    'metadata': dbQuest.metadata,
    // 'extraData': dbQuest.extradata,
    // "label": dbQuest.label,
    // "difficulty": dbQuest.difficulty || null,
    // "estimateTime": dbQuest.estimateTime || null,
  }
}

router.post("/check", async (req, res) => {
  // 签名验证、参数验证
  const { address, questId, answers } = req.body;

  const questService = new QuestService();

  let success = await questService.checkAnswer(questId, answers);

  await questService.addOrUpdateChallenge(questId, address, success, { answers });

  return succeed(res, { data: { 'succeed': success } }); //todo
});

/**
 * Create a new build in draft mode
 */
router.post("/", withSignature, async (req, res) => {
  // todo 参数验证
  const { title = '', description = '', uri, signature } = req.body;
  const [startTs, endTs, supply] = [0, 0, 0];

  const address = req.address;

  const verifyOptions = {
    messageId: "questSubmit",
    address,
    uri,
  };

  if (!verifySignature(signature, verifyOptions)) {
    res.status(401).send("Signature verification failed! Please reload and try again. Sorry!");
    return;
  }

  const cid = uri.replace('ipfs://', '');
  const metadata = await ipfsClient.getJSONDataFromCid(cid);
  const questData = {
    title,
    description,
    uri,
    'metadata': metadata || {},
    'extradata': { startTs, endTs, supply },
    'creator': address,
    'isDraft': false, // 当前发布不审核
    'submittedTimestamp': new Date().getTime(),
  };

  let permitSignature = await new Signer(process.env.SIGNER_PRIVATE_KEY).permitCreateQuest(address, questData);

  let resp = {
    code: 0,
    msg: 'OK',
    data: permitSignature,
  }
  res.json(resp);
});

module.exports = router;
