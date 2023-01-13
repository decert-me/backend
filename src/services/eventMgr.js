const logger = require('../utils/logger');
const db = require('../utils/db');
const { USER_CHALLENGE_STATUS } = require('../constants');
const IpfsClient = require("../utils/customIpfsClient");
const ipfsClient = new IpfsClient();


class EventMgr {
    constructor() { }

    async handleEvents(events) {
        for (let event of events) {
            await this.handleEvent(event);
        }
    }

    async handleEvent(event) {
        await this._saveEvent(event);

        switch (event.type) {
            case 'QuestCreated':
                await this._handleQuestCreated(event)
                break;
            case 'Claimed':
                await this._handleClaimed(event)
                break;
            default:
                break;
        }
    }

    async _saveEvent(event) {
        let payload = {};

        for (const [key, value] of Object.entries(event.data)) {
            if (typeof (value) === 'object' && value._isBigNumber) {
                payload[key] = value.toString();
            } else {
                payload[key] = value;
            }
        }

        const eventData = {
            'type': event.type,
            'timestamp': new Date().getTime(),
            'payload': payload,
        }

        await db.add('events', eventData);
    }

    async _handleQuestCreated(event) {
        let { tokenId, creator, questData } = event.data;
        tokenId = tokenId.toString();
        let { startTs, endTs, supply, title, uri } = questData
        supply = supply.toNumber();

        const cid = uri.replace('ipfs://', '');
        const metadata = await ipfsClient.getJSONDataFromCid(cid);
        if (!metadata) return logger.warn('_handleQuestCreated: no metadata', { cid });

        const { description, } = metadata;

        const dbQquestData = {
            'title': title,
            'description': description,
            'tokenId': tokenId,
            'uri': uri,
            'type': 0, //todo
            'creator': creator,
            'metadata': metadata,
            'extradata': { startTs, endTs, supply },
            'isDraft': false,
            'addTs': new Date().getTime(),
        };
        await db.add('quest', dbQquestData);
    }

    async _handleClaimed(event) {
        let { tokenId, sender } = event.data;
        tokenId = tokenId.toString();

        const quest = await db.getOne('quest', { tokenId });
        if (!quest) {
            logger.warn('no such tokenId in quest', { tokenId });
            return;
        }

        const record = await db.getOne('user_challenges', { 'address': sender, 'questId': quest.id });
        if (record) {
            // update
            if (record.claimed === false) await db.update('user_challenges', { 'address': sender, 'questId': quest.id }, { 'claimed': true, 'claim_ts': new Date().getTime() });
        } else {
            // create
            const nowTs = new Date().getTime();
            const challengeData = {
                'address': sender,
                'questId': quest.id,
                'status': USER_CHALLENGE_STATUS['SUCCEED'],
                'content': {},
                'claimed': true,
                'add_ts': nowTs,
                'update_ts': nowTs,
                'claim_ts': nowTs
            }
            await db.add('user_challenges', challengeData);
        }
    }
}


module.exports = new EventMgr();
