var CivilState = artifacts.require("./CivilState.sol")

module.exports = function(deployer, network, accounts) {

  const hospital = accounts[1]
  const prefecture = accounts[2]
  const cityHall = accounts[3]

  deployer.deploy(CivilState, hospital, prefecture, cityHall)
};
