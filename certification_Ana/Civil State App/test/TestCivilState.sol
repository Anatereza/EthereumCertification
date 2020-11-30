// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CivilState.sol";

contract TestCivilState {

  function testOwnerAddress() public {
    
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address expectedOwner = address(this);

    Assert.equal(civilstate.getOwner(), expectedOwner, "The owner of this contract should have been thi constract");

  }

  function testAddHospitalMember() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addHospitalMember(newMember, "newMember1");

    Assert.equal(civilstate.isHospitalMember(), newMember, "The owner of this contract should be a hospital member");

  }

  function testAddPrefectureMember() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addPrefectureMember(newMember, "newMember1");

    Assert.equal(civilstate.isPrefectureMember(), newMember, "The owner of this contract should be a prefecture member");

  }

  function testAddCityHallMember() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addCityHallMember(newMember, "newMember1");

    Assert.equal(civilstate.isCityHallMember(), newMember, "The owner of this contract should be a city hall member");

  }

  function testAddBirth() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addHospitalMember(newMember, "newMember1");
    // Add new birth 
    uint birthCount = civilstate.addBirth("bob", "smith", "2020-01-01", "New York");
    // Add second birth
    birthCount = civilstate.addBirth("marie", "smith", "2020-01-02", "Los Angeles");
    uint expectedBirthCount = 2;
    Assert.equal(birthCount, expectedBirthCount, "The expected birth count should have been 2");   
  }

  function testVerifyIdentity() public {
    CivilState civilstate = new CivilState();
    
    //The expected owner is this contract
    address newMember = address(this);

    civilstate.addHospitalMember(newMember, "newMember1");
    civilstate.addPrefectureMember(newMember, "newMember1");
    
    // Add new birth 
    uint birthCount = civilstate.addBirth("bob", "smith", "2020-01-01", "New York");
    // Verify identity
    uint identityCount = civilstate.verifyIdentity(birthCount);
    uint expectedIdentityCount = 1;
    Assert.equal(identityCount, expectedIdentityCount, "The expected identity count should have been 1");
  }

}
