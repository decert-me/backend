const db = require("../utils/db");
const UserService = require('./user');

class BadgeService {
    constructor() {

    }

    async share(tokenId, userAddress) {
        let info = {};
        const badge = await this.getByTokenIdFromDb(tokenId);

        info.badge = badge ? {
            'metadata': badge.metadata,
        } : null;

        if (userAddress) {
            const user = new UserService(userAddress).getByAddressFromDb(userAddress);
            info.user = user ? {
                'address': userAddress,
                'getTime': Math.floor(new Date().getTime() / 1000), // todo
            } : null
        }

        return info;
    }

    async getByTokenIdFromDb(tokenId) {
        const badge = await db.getOne('quest', { tokenId });
        return badge || null;
    }
}

module.exports = BadgeService;