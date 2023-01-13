const logger = require('../utils/logger');
const db = require('../utils/db');
const Transaction = require('./transaction');
const contractMgr = require('../contracts/contractMgr');
const eventMgr = require('../services/eventMgr');


class TransactionMgr {
    constructor() {
        this.pendingHashs = [];
        this.initLoadPendingHashs();
    }

    async initLoadPendingHashs() {
        let where = { status: -1 };
        let records = await db.get('transaction', where);
        if (records) {
            records.forEach(ele => {
                logger.debug('initLoadPendingHashs', ele.hash);
                this.addPendingHash(ele.hash);
            });
        }

        this.scheduleJob();
    }

    async submit(hash) {
        const tx = { hash };

        //  if existed in database, do nothing
        let record = await db.getOne('transaction', tx);
        if (record) return true;

        let newRecord = await db.add('transaction', tx);
        if (!newRecord) return false;

        this.addPendingHash(hash);
        return true;
    }

    addPendingHash(hash) {
        // echeck if exist
        if (this.pendingHashs.includes(hash)) return;

        this.pendingHashs.push(hash);
    }

    scheduleJob() {
        setInterval(async () => {
            await this.handlePendingHash();
        }, 3000);
    }

    async handlePendingHash() {
        // todo lock

        let hash = this.pendingHashs.shift();
        if (!hash) return false;

        return await this._handlePendingHash(hash);
    }

    async _handlePendingHash(hash) {
        logger.debug('====_handlePendingHash====', hash);

        let transaction = new Transaction(hash);
        await transaction.parse();

        if (transaction.status === -1) {
            this.pendingHashs.push(hash);
            return false;
        }

        await transaction.update({ 'status': transaction.status, 'receipt': transaction.receipt });

        let contracts = contractMgr.getContracts(['QuestMinter', 'Badge', 'Quest']);
        let events = await transaction.getEventData(contracts); // 获取特定合约的事件

        await eventMgr.handleEvents(events);

        // await this.addEvents(events);

        return true;
    }

    async addEvents(events) {
        if (events.length === 0) return;
        await db.addEvents(events);
    }
}

module.exports = new TransactionMgr();