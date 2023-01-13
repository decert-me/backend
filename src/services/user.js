const db = require("../utils/db");


class UserService {
    constructor(address) {
        this.address = address;
    }

    async getByAddressFromDb(address) {
        const user = await db.getOne('users', { address });
        return user || null;
    }

    async getAuthInfo() {
        const claimable = false;
        const updateAble = false;

        const depass = await db.getOne('depass', { 'owner': this.address }) || null;
        const user = await db.findUserByAddress(this.address);

        const socials = user.socials || [];
        if (socials.length > 0) {
            // claimed -> claimable = false
            if (!depass) claimable = true;

            // 对比合约和数据库数据，发现不一致 //todo
        }

        let authInfo = { depass, socials, claimable, updateAble };

        return authInfo;
    }

    async getDiscordInfo() {
        const user = await db.getOne('users', { 'address': this.address });
        if (!user || !user.socials || !user.socials.discord) return null;
        return user.socials.discord;
    }
}

module.exports = UserService;