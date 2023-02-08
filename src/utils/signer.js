const { ethers } = require('ethers');
const CONTRACT_ADDRS = require('../contracts/addresses.json');
const BADGE_ADDRESS = CONTRACT_ADDRS.Badge;
const QUEST_MINTER_ADDRESS = CONTRACT_ADDRS.QuestMinter;


class Signer extends ethers.Wallet {
    constructor(privateKey, provider) {
        super(privateKey, provider);
    }

    async permitCreateQuest(creator, quest) {
        const { title, uri, extradata: extraData } = quest;
        const { startTs, endTs, supply } = extraData;

        const types = ['uint32', 'uint32', 'uint192', 'string', 'string'];
        const values = [startTs, endTs, supply, title, uri];

        return this._permit(types, values, QUEST_MINTER_ADDRESS, creator);
    }

    async permitClaimBadge(sender, values) {
        const types = ['uint256','uint256'];
        
        return this._permit(types, values, BADGE_ADDRESS, sender);
    }

    async _permit(...params) {
        const [types, values, contract, sender] = params;

        const hash = ethers.utils.solidityKeccak256([...types, 'address', 'address'], [...values, contract, sender]);

        const signature = await this.signMessage(ethers.utils.arrayify(hash));

        return signature;
    }
}

module.exports = Signer;