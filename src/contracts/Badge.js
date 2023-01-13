const BaseContract = require('./base.js');


class Badge extends BaseContract {
    constructor(address, abi, provider) {
        super(address, abi, provider);
        this.topics = [];
    }
}


module.exports = Badge;