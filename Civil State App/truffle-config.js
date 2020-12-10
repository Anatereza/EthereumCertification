const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = '9f5200b7e0f749539914b11c33288abb';
const fs = require('fs');
//const mnemonic = fs.readFileSync('.secret').toString().trim();
const mnemonic = 'lobster mistake spider alien have nuclear inquiry pledge mechanic guard horse issue';
const infuraURL = 'https://rinkeby.infura.io/v3/9f5200b7e0f749539914b11c33288abb';
var HDWallet = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
       network_id: "*",
       host: 'localhost',
       port: 8545,
    },

    rinkeby : {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      network_id: 4,          // Rinkeby's network id
      gas: 5500000      
    }

   }, 
   settings: {
   optimizer: {
     enabled: true,
     runs: 200
   }
},

};
