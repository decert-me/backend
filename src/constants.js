const CHALLENGE_SUBMISSION_STATUS = {
  'ACCEPTED': "ACCEPTED",
  'REJECTED': "REJECTED",
  'SUBMITTED': "SUBMITTED",
};

const USER_CHALLENGE_STATUS = {
  'FAILED': 0, // 挑战失败
  'PENDING': 1,//等待确认
  'SUCCEED': 2, // 挑战成功
};

const LOGIN_AUTH_MSG = 'Welcome to Decert.me.\nPlease sign this message to login Decert.me.';

module.exports = {
  CHALLENGE_SUBMISSION_STATUS,
  USER_CHALLENGE_STATUS,
  LOGIN_AUTH_MSG,
}