const express = require("express");
const db = require("../utils/db");
const { withSignature } = require("../middlewares/auth");
const router = express.Router();
const { fail, succeed } = require("./base");
const func = require("../utils/func");
const transactionMgr = require("../services/transactionMgr");


/**
 * Post transaction hash
 */
router.post("/submit", withSignature, async (req, res) => {
    let { hash } = req.body;

    if (!hash || !func.validateTxHash(hash)) return fail(res, 'invalid hash');

    hash = hash.toLowerCase();

    let bool = await transactionMgr.submit(hash);
    if (!bool) return fail(res, 'submit failed');

    return succeed(res);
});


module.exports = router;
