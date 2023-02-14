// const { TwitterApi } = require('twitter-api-v2');
const needle = require('needle');
const logger = require('./logger');
const endpointURL = 'https://api.twitter.com/2/tweets?ids=';
const BEAR_TOKEN = process.env.TWITTER_BEAR_TOKEN;


async function generateOAuth2AuthLink() {
    const client = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(process.env.CALLBACK_URL, {
        scope: ['tweet.read', 'users.read', 'offline.access']
    });

    return { url, codeVerifier, state }
}

async function getAccessToken() {
    const client = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    const code = 'dFJiZHY5TVhXSkZlaGNEMW10LVdvT2dnbkktenZ5VFVuV1Y5NEVRQzg1bGdROjE2NzE1MTc0ODM2NDg6MToxOmFjOjE';
    const codeVerifier = '1lGlY4rPx6BY_cLadfRncJ2fpA9w43jHjxzdc7TU~vsAw~n2yc7LgbzqxqUFIOqUdcIiUOx-OEkmX7jrkg09MmapnUBLYA-6yYEirk28hqs5yf.Snhmy0hf~r~dHjXYR';
    const redirectUri = process.env.CALLBACK_URL;

    const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({ code, codeVerifier, redirectUri });

    console.log('Access token for logged client:', accessToken);
    console.log('Refresh token to store for client:', refreshToken);


    const meUser = await loggedClient.v2.me({ expansions: ['pinned_tweet_id'] });
    console.log(meUser);
}

async function getUserInfo2(accessToken) {
    const client = new TwitterApi(accessToken);
    const meUser = await client.v2.me({ expansions: ['pinned_tweet_id'] });
    console.log(meUser);
}

async function getTweetById(tweetId) {
    let tweet = null;
    const params = {
        'ids': tweetId,
        'tweet.fields': 'author_id',
        'expansions': 'author_id',
    };
    let res;
    try {
        res = await needle('get', endpointURL, params, {
            headers: {
                'User-Agent': 'v2TweetLookupJS',
                'authorization': `Bearer ${BEAR_TOKEN}`
            }
        });

        if (!res.body) return null;
    } catch (err) {
        logger.error('getTweetById failed', { tweetId }, err);
        return null;
    }

    let result = res.body;
    if (!result.data) return null;
    tweet = result.data[0];
    if (result.includes && result.includes.users) {
        let author = result.includes.users.find(ele => ele.id === tweet.author_id);
        if (author) {
            tweet.username = author.username;
        } else {
            tweet.username = '';
        }
    }
    return tweet;
}

async function getTweetFromURL(tweetURL) {
    let tweetId = _extractIdFromTweet(tweetURL);
    if (!tweetId) return null;

    let tweet = await getTweetById(tweetId);

    if (!tweet || !tweet.text) return null;
    return tweet;
}

function _extractIdFromTweet(tweetUrl) {
    let reg = new RegExp('https://twitter.com/.+\/status\/', 'g');
    let matched = tweetUrl.match(reg);
    if (!matched) return '';

    let target;
    target = tweetUrl.replace(matched, '');

    target = target.split('?');
    let tweetId = target[0];

    return tweetId;
}

async function unshortLink(shortLink) {
    let expandedURL = '';
    try {
        const { headers: { location } } = await needle('head', shortLink)
        if (location) expandedURL = location.replace(/\?.*/, '').replace(/\/+$/, '').replace(/\.$/, '')
    } catch (err) {
        logger.error('unshortLink', err);
    }
    return expandedURL;
}


module.exports = {
    generateOAuth2AuthLink,
    getAccessToken,
    getUserInfo2,
    getTweetFromURL,
    getTweetById,
    unshortLink,
}
