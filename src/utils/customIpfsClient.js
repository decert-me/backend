const axios = require('axios');
const logger = require('./logger');


class CustomIpfsClient {
    constructor() {
        this.baseURLrl = 'http://ipfs.learnblockchain.cn/';
    }

    async getDataFromCid(cid) {
        if (!cid) return null;

        let result = null;
        let url = this.baseURLrl + cid;

        try {
            let resp = await axios({
                'method': 'get',
                'url': url,
                'headers': {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            if (resp.status === 200) {
                result = resp.data;
            }
            logger.debug('getDataFromCid', cid, result);
        } catch (err) {
            logger.error('getDataFromCid failed', { cid, url }, err);
        }

        return result;
    }

    async getJSONDataFromCid(cid) {
        return this.getDataFromCid(cid);
    }
}

module.exports = CustomIpfsClient;