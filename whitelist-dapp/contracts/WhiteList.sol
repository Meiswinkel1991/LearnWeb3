// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error WhiteList__AlreadyWhitelisted();
error WhiteList__MaxNumberWhitelistedReached();

contract WhiteList {
    // max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    //Create a mapping of whitelistedAddresses
    //if an address is whitelisted, we would set it to true, it is false by default for all other addresses
    mapping(address => bool) public whitelistedAddresses;

    //numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    // NOTE: Don't change this variable name, as it will be part of verification
    uint8 public numAddressesWhitelisted;

    //Setting the max number of whitelisted addresses
    //user will put the value at the time of deployment
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    /**
     *  @dev - this function add the address of the sender to the whitelist
     */
    function addAddressToWhitelist() public {
        //check if the user has already been whitelisted
        if (whitelistedAddresses[msg.sender]) {
            revert WhiteList__AlreadyWhitelisted();
        }
        //check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not throw an error
        if (numAddressesWhitelisted >= maxWhitelistedAddresses) {
            revert WhiteList__MaxNumberWhitelistedReached();
        }

        //Add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        //Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }
}
