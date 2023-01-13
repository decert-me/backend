const { ethers } = require('ethers');
const logger = require('../utils/logger');


class BaseContract extends ethers.Contract {
    constructor(address, abi, provider) {
        super(address, abi, provider);
        this.abi = abi;
    }

    async getEventData(receipt) {
        if (!receipt) return logger.warn('getEventData no receipt', { 'contract': this.address, receipt });

        let events = [];

        let { transactionHash, logs } = receipt;

        for (let log of logs) {
            try {
                let data = this.interface.parseLog(log);

                let args = {};
                let keys = data.eventFragment.inputs.map(ele => ele.name);
                for (let key of keys) {
                    let val = data.args[key];
                    args[key] = val;
                }

                events.push({
                    'type': data.name,
                    'hash': transactionHash,
                    'data': args
                })
            } catch (err) {
                // logger.error('parseLog failed', log, err);
            }
        }

        return events;
    }
}

module.exports = BaseContract;