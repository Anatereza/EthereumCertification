var CivilState = artifacts.require("./CivilState.sol")
var LibTransformUintString = artifacts.require("./LibTransformUintString.sol")
var LibConcatenateStrings = artifacts.require("./LibConcatenateStrings.sol")

module.exports = function(deployer) {

  deployer.deploy(LibTransformUintString);
  deployer.link(LibTransformUintString, CivilState);
  deployer.deploy(LibConcatenateStrings);
  deployer.link(LibConcatenateStrings, CivilState);
  deployer.deploy(CivilState)
};
