// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

library LibTransformUintString {
    // Function to transform a uint to a string
    function uintToString(uint256 v) public pure returns (string memory str) {
        uint256 maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint256 i = 0;
        while (v != 0) {
            uint256 remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i + 1);
        for (uint256 j = 0; j <= i; j++) {
            s[j] = reversed[i - j];
        }
        str = string(s);
    }    
}