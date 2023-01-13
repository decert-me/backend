const { ethers } = require('ethers');
const BaseContract = require('./base.js');


class QuestMinter extends BaseContract {
    constructor(address, abi, provider) {
        super(address, abi, provider);
        this.topics = [
            ethers.utils.id('QuestCreated(uint256,address,uint256,uint256,string)'),
            ethers.utils.id('Claimed(uint256,address)'),
        ];
    }
}

module.exports = QuestMinter;