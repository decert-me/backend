const db = require("../utils/db");
const twitterUtil = require("../utils/twitter");
const UserService = require('./user');

const CLAIM_TWEET_CONTENT = [
    '我通过了@DecertMe的挑战并获得了一个链上的能力认证徽章。',
    'https://decert.me/quests/', //+tokenId
    '#Decert.me'
];

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

    async sumbitClaimTweet(address, tokenId, tweetURL) {
        const tweet = await twitterUtil.getTweetFromURL(tweetURL);

        if (!tweet) return false;

        const isMatch = await this._checkIfMatchClaimTweet(tokenId, tweet);

        if (isMatch) {
            // 保存到数据库
            const claimTweet = {
                address,
                tokenId,
                url: tweetURL,
                add_ts: new Date().getTime(),
                airdroped: false,
            }

            await db.add('claim_badge_tweet', claimTweet);
        }

        return isMatch;
    }

    async _checkIfMatchClaimTweet(tokenId, tweet) {
        const { text } = tweet;
        const lines = text.split('\n');

        if (lines.length != CLAIM_TWEET_CONTENT.length) return false;

        // first line
        if (lines[0].trim() !== CLAIM_TWEET_CONTENT[0]) return false;

        // third line
        if (lines[2].trim() !== CLAIM_TWEET_CONTENT[2]) return false;

        // second line
        const expectURL = CLAIM_TWEET_CONTENT[1].trim() + tokenId;
        const shortedURL = lines[1]; // twitter会使用短链接
        const expandedURL = await twitterUtil.unshortLink(shortedURL);
        if (expandedURL !== expectURL) return false;

        return true;
    }
}

module.exports = BadgeService;