// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CivilState.sol";

contract TestCivilState {

  function testVerifyIdentity() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addHospitalMember(newMember, "newMember1");
    civilstate.addPrefectureMember(newMember, "newMember1");
    
    // Add new birth 
    uint birthId = civilstate.addBirth("bob", "smith", "2020-01-01", "New York");
    // Verify identity
    civilstate.verifyIdentity(birthId);
    Assert.equal(civilstate.getIdentitiesCount(), 1, "The expected identity count should have been 1");
  }

}
