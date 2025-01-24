// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NameStorage {
    string[] private storedNames;
    
    function storeName(string memory _name) public {
        storedNames.push(_name);
    }
    
    function getName(uint256 index) public view returns (string memory) {
        require(index < storedNames.length, "Index out of bounds");
        return storedNames[index];
    }
    
    function getAllNames() public view returns (string[] memory) {
        return storedNames;
    }
    
    function getNameCount() public view returns (uint256) {
        return storedNames.length;
    }
} 