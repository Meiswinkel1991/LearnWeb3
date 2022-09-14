// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

error CryptoDevs__ContractPaused();
error CryptoDevs__PresaleNotRunning();
error CryptoDevs__PresaleNotEnded();
error CryptoDevs__NotWhitelisted();
error CryptoDevs__ExceedTokenSupply();
error CryptoDevs__NotEnoughEther();
error CryptoDevs__FailedEtherSend();

contract CryptoDevs is ERC721Enumerable, Ownable {
    /**
     * @dev i_baseTokenURI for computing {tokenURI}. If set, the resulting URI for each token will be the concatenation of the 'baseURI' and the 'tokenId'
     */
    string s_baseTokenURI;

    // i_price is the price of one NFT (immutable value)
    uint256 immutable i_price = 0.01 ether;

    // max number of CryptorDevs
    uint256 immutable i_maxTokenIds = 20;

    //total number of tokenIds minted
    uint256 public s_tokenIds;

    // s_paused is used to pause the contract in case of an emergency
    bool public s_paused;

    // boolean to keep track of wether presale started or not
    bool public s_presaleStarted;

    // timestamp for when presale would end
    uint256 public s_presaleEnded;

    // Whitelist contract instance
    IWhitelist whitelist;

    /** Modifiers */
    modifier onlyWhenNotPaused() {
        if (s_paused) {
            revert CryptoDevs__ContractPaused();
        }
        _;
    }

    /**
     * @dev ERC721 construcor takes a 'name' and a 'symbol' to the token collection.
     * @param baseURI - set the i_baseTokenURI for the NFT collection
     * @param whitelistContract - initialize an instance of the Whitelist contract
     * @param symbol - set the symbol of the NFT token collection
     * @param name - set the name of the NFT token collection
     */
    constructor(
        string memory baseURI,
        address whitelistContract,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        s_baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    /**
     * @dev startPresale starts a presale for the whitelisted addresses
     */
    function startPresale() public onlyOwner {
        s_presaleStarted = true;

        s_presaleEnded = block.timestamp + 5 days;
    }

    /**
     * @dev presaleMint allows a user to mint one NFT per transaction during presale
     */
    function presaleMint() public payable onlyWhenNotPaused {
        //Check if the presale is running
        if (!s_presaleStarted && block.timestamp >= s_presaleEnded) {
            revert CryptoDevs__PresaleNotRunning();
        }
        // Check if the maximum total supply doesnt exceed
        if (s_tokenIds >= i_maxTokenIds) {
            revert CryptoDevs__ExceedTokenSupply();
        }
        //Check if the message.sender is whitelisted
        if (!whitelist.whitelistedAddresses(msg.sender)) {
            revert CryptoDevs__NotWhitelisted();
        }
        //Check the right amount of ether send
        if (msg.value < i_price) {
            revert CryptoDevs__NotEnoughEther();
        }

        s_tokenIds += 1;

        //_safeMint is a safer version of the _mint function as it ensures that
        // if the address being minted to is a contract, then it knows how to deal with ERC721 tokens
        // If the address being minted to is not a contract, it works the same way as _mint
        _safeMint(msg.sender, s_tokenIds);
    }

    /**
     * @dev mint allows a user to mint 1 NFT per transaction after presale ended
     */
    function mint() public payable onlyWhenNotPaused {
        //Check the right amount of ether send
        if (msg.value < i_price) {
            revert CryptoDevs__NotEnoughEther();
        }
        // Check if the maximum total supply doesnt exceed
        if (s_tokenIds >= i_maxTokenIds) {
            revert CryptoDevs__ExceedTokenSupply();
        }
        //check if the presale has ended
        if (block.timestamp <= s_presaleEnded) {
            revert CryptoDevs__PresaleNotEnded();
        }
        s_tokenIds += 1;
        _safeMint(msg.sender, s_tokenIds);
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default an empyt string for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return s_baseTokenURI;
    }

    /**
     * @dev setPaused makes the contract paused or unpaused
     */
    function setPaused(bool val) public onlyOwner {
        s_paused = val;
    }

    /**
     * @dev withdraw the Ether to the owner of the contract
     */
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        if (!sent) {
            revert CryptoDevs__FailedEtherSend();
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
