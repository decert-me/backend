const router = require("express").Router();
const { withSignature } = require("../middlewares/auth");
const { getSignMessageForId, } = require("../utils/sign");
const { fail, succeed } = require("./base");


router.get("/", withSignature, async (req, res) => {
    const messageId = req.query.messageId ?? "login";
    const options = req.query;

    let signature = getSignMessageForId(messageId, options)
    // res.status(200).send(getSignMessageForId(messageId, options));

    return succeed(res, { 'data': signature });
});


module.exports = router;