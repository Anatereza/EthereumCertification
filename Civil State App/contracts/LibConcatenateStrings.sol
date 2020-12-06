// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

library LibConcatenateStrings {
    // Function to concatenate two strings
    function concatenate(string memory a, string  memory b) public pure returns(string memory) {
        return string(abi.encodePacked(a, b));
    }
}