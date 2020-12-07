// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
import {SafeMath} from './SafeMath.sol';
    /*
        The CivilState contract keeps track of the citizen information, starting from their birth and being maintained throughout their life
     */
contract CivilState {
    using SafeMath for uint;

    uint birthsCount = 0;

    function addBirth () public view returns(uint) {
        //uint birthId = birthsCount++;
        uint birthId = birthsCount.add(1);
        return birthId;
    }   

    // Function to get the birthId after the creation of a new birth
    function getBirthId () public view returns (uint _birthId){
        _birthId = birthsCount.sub(1);
        /*if (birthsCount >= 0) {
            _birthId = birthsCount - 1;
            _name = births[_birthId].name;
            _lastName = births[_birthId].lastName;
        } */   
    }
 }    
