// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;


library ConcatenateStrings {
    // Function to concatenate two strings
    function concatenate(string memory a, string  memory b) public pure returns(string memory) {
        return string(abi.encodePacked(a, b));
    }
}

library TransformUintString {
    // Function to transform a uint to a string
    function uintToString(uint v) public pure returns (string memory str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i + 1);
        for (uint j = 0; j <= i; j++) {
            s[j] = reversed[i - j];
        }
        str = string(s);
    }    
}

    /*
        The CivilState contract keeps track of the citizen information, starting from their birth and being maintained throughout their life
     */
contract CivilState {
    using ConcatenateStrings for *;
    using TransformUintString for *;

    function testConcatenat (string memory _memberName) public pure returns (string memory) {
        // Initialization of login
        string memory login = "login_";
        string memory _login = login.concatenate(_memberName);        
        return _login;
    }    

    function testToString (uint v) public pure returns (string memory) {
        string memory test = v.uintToString();
        return test;
    }
 }    
