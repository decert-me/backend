const ethers = require("ethers");

const getSignMessageForId = (messageId, options) => {
  switch (messageId) {
    case "questSubmit":
      return JSON.stringify({
        messageId,
        address: options.address,
        uri: options.uri,
      });
    default:
      return `I would like to register as a builder in Decert.me as ${options.address}`;
  }
};

const verifySignature = (signature, verifyOptions) => {
  const trustedMessage = getSignMessageForId(verifyOptions.messageId, verifyOptions);
  const signingAddress = ethers.utils.verifyMessage(trustedMessage, signature);

  return signingAddress === verifyOptions.address;
};

module.exports = {
  getSignMessageForId,
  verifySignature,
};
