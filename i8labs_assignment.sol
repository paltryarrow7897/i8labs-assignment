// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract i8labs_assignment {
    struct userData {
        address userWallet;
        string userName;
        string userAddress;
        string userDob;
        bool userRegistered;
    }

    event UserAdded (address indexed _userWallet, string _userName, string _userAddress, string _userDob);
    event UserEdit (address indexed _userWallet, 
                    string _newName, string _prevName, 
                    string _newAddress, string _prevAddress,
                    string _newDob, string _prevDob);

    mapping (address => userData) userWalletToUserData;

    function addNew(
        string memory _userName,
        string memory _userAddress,
        string memory _userDob
    ) external {
        require(userWalletToUserData[msg.sender].userRegistered != true);
        require(bytes(_userName).length != 0 &&
                bytes(_userAddress).length != 0 &&
                bytes(_userDob).length != 0);

        userData memory _userData = userData({
            userWallet: msg.sender,
            userName: _userName,
            userAddress: _userAddress,
            userDob: _userDob,
            userRegistered: true
        });

        userWalletToUserData[msg.sender] = _userData;
        emit UserAdded(msg.sender, _userName, _userAddress, _userDob);       
    }

    function edit(
        string memory _userName,
        string memory _userAddress,
        string memory _userDob
    ) external {
        require(userWalletToUserData[msg.sender].userRegistered == true);
        require(bytes(_userName).length != 0 ||
                bytes(_userAddress).length != 0 ||
                bytes(_userDob).length != 0);

        userData memory _userData = userWalletToUserData[msg.sender];
        string memory _prevName = _userData.userName;
        string memory _prevAddress = _userData.userAddress;
        string memory _prevDob = _userData.userDob;

        if (bytes(_userName).length != 0) {
            _userData.userName = _userName;
        }
        if (bytes(_userAddress).length != 0) {
            _userData.userAddress = _userAddress;
        }
        if (bytes(_userDob).length != 0) {
            _userData.userDob = _userDob;
        }

        userWalletToUserData[msg.sender] = _userData;
        emit UserEdit(
            msg.sender, _userName, _prevName, _userAddress, _prevAddress, _userDob, _prevDob
        );
    }

    function viewUser() external view returns (userData memory) {
        return userWalletToUserData[msg.sender];
    }
}