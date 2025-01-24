// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserAuthentication {
    struct User {
        string username;
        string passwordHash;  // Store hashed password for security
    }
    
    mapping(address => User) public users;

    // Register a new user
    function register(string memory username, string memory passwordHash) public {
        require(bytes(username).length > 0, "Username is required");
        require(bytes(passwordHash).length > 0, "Password is required");

        users[msg.sender] = User(username, passwordHash);
    }

    // Validate user credentials (just a simple example)
    function validateUser(string memory username, string memory passwordHash) public view returns (bool) {
        if (keccak256(abi.encodePacked(users[msg.sender].username)) == keccak256(abi.encodePacked(username)) &&
            keccak256(abi.encodePacked(users[msg.sender].passwordHash)) == keccak256(abi.encodePacked(passwordHash))) {
            return true;
        }
        return false;
    }
}
