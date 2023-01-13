const logger = require('../utils/logger');
const providerMgr = require('../utils/providerMgr');
const db = require('../utils/db');


class Transaction {
    constructor(hash) {
        this.hash = hash;
        this.receipt = null;
        this.status = -1;
        this.events = [];
    }

    async parse() {
        const receipt = await this.getReceipt();
        if (!receipt) return -1;

        this.receipt = receipt;
        this.status = receipt.status;

        return this;
    }

    async getStatus() {
        if (this.status !== -1) return this.status;
        return await this.checkStatus();

    }

    async getReceipt() {
        let receipt = null;
        try {
            const provider = providerMgr.getRpcProvider();
            receipt = await provider.getTransactionReceipt(this.hash);
        } catch (err) {
            logger.error('Transaction getReceipt failed', { hash: this.hash }, err);
        }
        return receipt;
    }

    async checkStatus() {
        const receipt = await this.getReceipt();
        if (!receipt) return -1;

        this.status = receipt.status;

        return this.status;
    }

    async update(upData) {
        await db.update('transaction', { 'hash': this.hash }, upData);
    }

    async getEventData(contracts) {
        let events = [];
        for (let contract of contracts) {
            if (!contract) continue;
            let evns = await contract.getEventData(this.receipt);
            events = events.concat(evns);
        }

        return events;
    }
}

module.exports = Transaction;