// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICryptoDevs.sol";

error CryptoTurtleToken__NotEnoughEther();
error CryptoTurtleToken__OverflowMaximumSupply();
error CryptoTurtelToken__NoNFTOwnership();
error CryptoTurtelToken__AllTokensClaimed();
error CryptoTurtelToken__FailedTransferEther();

contract CryptoTurtleToken is ERC20, Ownable {
    //Price of one Crypto Dev Token
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    // Each NFT would give the user 10 tokens
    uint256 public constant TOKEN_PER_NFT = 10 * 10**18;
    // the max total supply is 10000 Crypto Turtle Tokens
    uint256 public constant MAX_TOTAL_SUPPLY = 10000 * 10**18;

    // CryptoDevsNFT contract instance
    ICryptoDevs CryptoDevsNFT;

    //mapping to keep tracj of which tokenIds have been claimed
    mapping(uint256 => bool) public s_tokenIdsClaimed;

    constructor(address _cryptoDevsContrac) ERC20("Crypto Turtle Token", "CT") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContrac);
    }

    /**Functions */

    /**
     * @dev mint new tokens till the maximum supply will be reached
     * @param amount - the amount of tokens want to mint with decimals (10**18)
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = (TOKEN_PRICE * amount) / 10**18;
        if (msg.value < _requiredAmount) {
            revert CryptoTurtleToken__NotEnoughEther();
        }

        if (totalSupply() + amount > MAX_TOTAL_SUPPLY) {
            revert CryptoTurtleToken__OverflowMaximumSupply();
        }
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amount);
    }

    /**
     * @dev all NFT owner can claim a total of 10 tokens for free (10 for each NFT Token)
     * Requirements:
     *  - The amount of NFT Tokens have to be greater than 0
     *  - Tokens should have not been claimed for all the NFTs owned by the sender
     */
    function claim() public {
        // Get the number of CryptoDev NFT's held by a given sender address
        uint256 _balance = CryptoDevsNFT.balanceOf(msg.sender);
        if (_balance == 0) {
            revert CryptoTurtelToken__NoNFTOwnership();
        }
        // amount keeps track of number of unclaimed tokenIds
        uint256 _amount;
        for (uint i = 0; i < _balance; i++) {
            uint256 _tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            if (!s_tokenIdsClaimed[_tokenId]) {
                _amount += TOKEN_PER_NFT;
                s_tokenIdsClaimed[_tokenId] = true;
            }
        }
        if (_amount == 0) {
            revert CryptoTurtelToken__AllTokensClaimed();
        }

        _mint(msg.sender, _amount);
    }

    /**
     * @dev withdraw all ETH from this contract to the owner contract
     * Requirements:
     *  - only the owner can withdraw the funds from this contract
     */
    function withdraw() external onlyOwner {
        address _owner = owner();
        uint256 _amount = address(this).balance;
        (bool sent, ) = _owner.call{value: _amount}("");
        if (!sent) {
            revert CryptoTurtelToken__FailedTransferEther();
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
