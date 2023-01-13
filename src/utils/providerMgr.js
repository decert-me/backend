const { ethers } = require('ethers');

class RpcProvider extends ethers.providers.JsonRpcProvider {
    constructor(option) {
        super(option);
    }
}

class ProviderMgr {
    constructor() {
        this.providers = {
            'rpcProvider': null,
        };
    }

    getRpcProvider() {
        let provider = this.providers['rpcProvider'];
        if (!provider) {
            provider = new RpcProvider({
                url: process.env.PROVIDER_URL,
                timeout: 15000
            });
            this.providers['rpcProvider'] = provider;
        }
        return provider;
    }
}


module.exports =  new ProviderMgr();