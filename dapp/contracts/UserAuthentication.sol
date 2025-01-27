// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserAuthentication {
    struct User {
        string username;
        bytes32 passwordHash;
    }
    
    User[] private users;

    mapping(address => User) public usersMapping;

    // Register a new user
    function register(string memory _username, bytes32 _passwordHash) public {
        require(bytes(_username).length > 0, "Username is required");
        require(_passwordHash != 0, "Password is required");

        users.push(User({
            username: _username,
            passwordHash: _passwordHash
        }));
        
        usersMapping[msg.sender] = User({
            username: _username,
            passwordHash: _passwordHash
        });
    }

    // Update the validation function to use bytes32 for password
    function validateUser(string memory _username, bytes32 _passwordHash) public view returns (bool) {
        User storage user = usersMapping[msg.sender];
        
        return (keccak256(abi.encodePacked(user.username)) == keccak256(abi.encodePacked(_username)) &&
                user.passwordHash == _passwordHash);
    }

    function getUserCount() public view returns (uint256) {
        return users.length;
    }

    function getUser(uint256 index) public view returns (string memory username, bytes32 passwordHash) {
        require(index < users.length, "User index out of bounds");
        User storage user = users[index];
        return (user.username, user.passwordHash);
    }
}
