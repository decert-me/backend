const db = require("../utils/db");
const UserService = require("./user");


class UserChanlengeService {
    constructor(address) {
        this.address = address;
    }

    async getChanlenges(options = {}) {
        let where = options;
        options.address = this.address;
        const challenges = await db.get('user_challenges', where);

        return challenges;
    }
}

module.exports = UserChanlengeService;