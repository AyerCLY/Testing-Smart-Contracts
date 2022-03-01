const HDWalletProvider = require("truffle-hdwallet-provider");
const LoomTruffleProvider = require('loom-truffle-provider');
const mnemonic = "YOUR MNEMONIC HERE";
module.exports = {
    // Object with configuration for each network
    networks: {
        //development
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gas: 9500000
        },
        // Configuration for Ethereum Mainnet
        mainnet: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/<YOUR_INFURA_API_KEY>")
            },
            network_id: "1" // Match any network id
        },
        // Configuration for Rinkeby Metwork
        rinkeby: {
            provider: function() {
                // Setting the provider with the Infura Rinkeby address and Token
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/<YOUR_INFURA_API_KEY>")
            },
            network_id: 4
        },
        // Configuration for Loom Testnet
        loom_testnet: {
            provider: function() {
                const privateKey = 'YOUR_PRIVATE_KEY';
                const chainId = 'extdev-plasma-us1';
                const writeUrl = 'wss://extdev-basechain-us1.dappchains.com/websocket';
                const readUrl = 'wss://extdev-basechain-us1.dappchains.com/queryws';
//The accounts array
//In order to make Truffle "talk" to Loom we've replaced the default HDWalletProvider 
//with our own Truffle Provider. 
//As a result, we have to tell our provider to fill in the accounts array so we can test our game. 
//In order to do that, we are required to replace the line of code that returns a new LoomTruffleProvider:
// TODO: Replace the line below
                const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
                loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
                return loomTruffleProvider;
            },
            network_id: '9545242630824'
        }
    },
    compilers: {
        solc: {
            version: "0.4.25"
        }
    }
};
