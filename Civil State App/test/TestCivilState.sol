// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CivilState.sol";

contract TestCivilState {

  /**
  * @dev Check the "verifyIdentity" function
  *  - Add a new hospital member => check that only this address can "AddBirth"
  *  - Add a new prefecture member => check that only this address can "VerifyIdentity"
  *  - Check the identity count is added when a new identity is verified
  */
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
