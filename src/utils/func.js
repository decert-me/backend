const { ethers } = require('ethers');
const logger = require('./logger');
const sigUtil = require('@metamask/eth-sig-util');


function getChecksumAddress(address) {
    return ethers.utils.getAddress(address);
}

function validateOffset(value) {
    if (!value) return false;
    if (!Number.isInteger(Number(value))) return false;
    if (value < 0) return false;

    return true;
}

function validateLimit(value) {
    if (!value) return false;
    if (!Number.isInteger(Number(value))) return false;
    if (value <= 0) return false;

    return true;
}

function validateAddress(address) {
    // 0x221507c5cae31196a535f223c022eb0e38c3377d
    if (address) return ethers.utils.isAddress(address.toLowerCase());
    return false;
}

function validateTxHash(hash) {
    // 0x90445c9a8a4d19c57d195e29d00e88a5296cedfc20020c0eda56b7be05c1b96c
    if (hash.length !== 66 || !hash.startsWith('0x')) return false;
    return true;
}

function validateUInt(value) {
    if (!value) return false;
    if (Number.isNaN(value)) return false;

    if (!Number.isInteger(Number(value))) return false;
    if (value < 0) return false;

    return true;
}

async function authSignature(data) {
    let { msg, signature, address } = data;
    let msgParams = {
        'data': msg,
        'signature': signature,
        'method': 'personal_sign',
    }

    try {
        let singer = sigUtil.recoverPersonalSignature(msgParams)
        return singer == address.toLowerCase();
    } catch (err) {
        logger.warn('authSignature failed', data, err);
    }
    return false;
}

module.exports = {
    getChecksumAddress,
    validateOffset,
    validateLimit,
    validateAddress,
    validateTxHash,
    validateUInt,
    authSignature,
};