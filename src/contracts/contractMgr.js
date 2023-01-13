const BaseContract = require('./base');
const addresses = require('./addresses');
const logger = require('../utils/logger');
const providerMgr = require('../utils/providerMgr');


class ContractMgr {
    constructor() {
        this.provider = providerMgr.getRpcProvider();
        this.contracts = {};
        this.addContract('QuestMinter');
        this.addContract('Badge');
    }

    addContract(name) {
        if (this.contracts[name]) return this.contracts[name];

        try {
            const address = addresses[name];
            const abi = require(`./abis/${name}`);
            this.contracts[name] = new BaseContract(address, abi, this.provider);
        } catch (err) {
            logger.error('addContract failed', err);
        }
        return this.contracts[name];
    }

    getContract(name) {
        let contract = this.contracts[name];
        if (!contract) contract = this.addContract(name);
        return contract;
    }

    getContracts(names) {
        return names.map(name => {
            return this.getContract(name);
        });
    }
}

module.exports = new ContractMgr();