const { TwitterApi } = require('twitter-api-v2');


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

async function getAccessToken(){
    const client = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    const code = 'dFJiZHY5TVhXSkZlaGNEMW10LVdvT2dnbkktenZ5VFVuV1Y5NEVRQzg1bGdROjE2NzE1MTc0ODM2NDg6MToxOmFjOjE';
    const codeVerifier = '1lGlY4rPx6BY_cLadfRncJ2fpA9w43jHjxzdc7TU~vsAw~n2yc7LgbzqxqUFIOqUdcIiUOx-OEkmX7jrkg09MmapnUBLYA-6yYEirk28hqs5yf.Snhmy0hf~r~dHjXYR';
    const redirectUri = process.env.CALLBACK_URL;

    const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({ code, codeVerifier,redirectUri });

    console.log('Access token for logged client:', accessToken);
    console.log('Refresh token to store for client:', refreshToken);

        
    const meUser = await loggedClient.v2.me({ expansions: ['pinned_tweet_id'] });
    console.log(meUser);
}

async function getUserInfo2(accessToken){
    const client = new TwitterApi(accessToken);
    const meUser = await client.v2.me({ expansions: ['pinned_tweet_id'] });
    console.log(meUser);
}


module.exports = {
    generateOAuth2AuthLink,
    getAccessToken,
    getUserInfo2,
}
