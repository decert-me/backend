const db = require("../utils/db");
const logger = require("../utils/logger");
const { USER_CHALLENGE_STATUS } = require("../constants");


class QuestService {
    constructor() { }

    async checkAnswer(questId, answers) {
        if (!questId) return false;
        let quest = await this.getQuestById(questId);
        if (!quest) return false;

        let questions = quest.metadata?.properties?.questions;
        if (!questions) return false;

        let correct = true;

        try {
            answers = JSON.parse(answers);
            if (Object.keys(answers).length !== questions.length) return false;

            let rightAnswersIdxs = quest.metadata?.properties?.answers || [];

            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                let questionTitle = question.title;
                let rigntAnserIdx = rightAnswersIdxs[i];
                let rightAnswer = question.options[rigntAnserIdx];

                let userAnswer = answers[questionTitle];
                if (userAnswer !== rightAnswer) {
                    correct = false;
                    break;
                }
            }
        } catch (err) {
            logger.error('_checkQuest', { questId, answers }, err);
        }

        return correct;
    }

    async getQuestById(id) {
        if (!id) return null;

        return (await db.findQuestById(id)) || null;
    }

    async addOrUpdateChallenge(questId, address, succeed, options = {}) {
        let challengeId = null;

        const status = succeed ? USER_CHALLENGE_STATUS['SUCCEED'] : USER_CHALLENGE_STATUS['FAILED'];

        const userChallenge = await db.getOne('user_challenges', { questId, address });
        if (userChallenge) {
            // update
            challengeId = userChallenge.id;

            if (userChallenge.status >= status) return; // 高状态不需要再更改

            await db.update('user_challenges', { 'id': challengeId }, { status, 'update_ts': new Date().getTime() });
        } else {
            // create
            const challengeData = {
                address,
                questId,
                status,
                content: options,
                claimed: false,
                add_ts: new Date().getTime(),
                update_ts: new Date().getTime(),
            }
            challengeId = await db.add('user_challenges', challengeData);
        }

        return challengeId;
    }

    async getAvailableQuest(tokenId) {
        return await db.getOne('quest', { tokenId, 'disabled': false, 'isDraft': false });
    }
}

module.exports = QuestService;