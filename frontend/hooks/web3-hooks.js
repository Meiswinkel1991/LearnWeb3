import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3 } from "../store/web3-context";
import { whitelistData, nftCollectionData } from "../store/contract-data";
import { ethers } from "ethers";

export const useNativeBalance = () => {
  const { address, web3Provider } = useWeb3();

  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const _balance = await web3Provider.getBalance(address);

    setBalance(ethers.utils.formatEther(_balance));
  };

  useEffect(() => {
    if (web3Provider) {
      getBalance();
    }
  });

  return { balance };
};

export const useNftCollection = () => {
  const { signer, web3Provider, address, isConnected } = useWeb3();

  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  const [isOwner, setIsOwner] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const getContract = (withSigner) => {
    let _contract;
    if (withSigner) {
      _contract = new Contract(
        nftCollectionData.address,
        nftCollectionData.abi,
        signer
      );
      return _contract;
    }
    _contract = new Contract(
      nftCollectionData.address,
      nftCollectionData.abi,
      web3Provider
    );
    return _contract;
  };

  const presaleMint = async () => {
    try {
      const _contract = getContract(true);

      const tx = await _contract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      window.alert("You successfully minted a Crypto Dev!");
      return true;
    } catch (e) {
      console.error(e);
    }
  };

  const publicMint = async () => {
    try {
      const _contract = getContract(true);

      const tx = await _contract.mint({
        value: utils.parseEther("0.01"),
      });
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      window.alert("You successfully minted a Crypto Dev!");
      return true;
    } catch (e) {
      console.error(e);
    }
  };

  const startPresale = () => {};

  /** Fetching Contract Data Functions */
  const checkIfPresaleStarted = async () => {
    try {
      const _contract = getContract();
      const _presaleStarted = _contract.presaleStarted();

      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfPresaleEnded = async () => {};

  const getTokenIdsMinted = async () => {
    try {
      const _contract = getContract();

      const _tokenIds = await _contract.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }

      getTokenIdsMinted();
    }
  });

  return {
    presaleStarted,
    presaleEnded,
    tokenIdsMinted,
    isOwner,
    isLoading,
    publicMint,
    presaleMint,
  };
};

export const useWhitelistDapp = () => {
  const { signer, web3Provider, address, isConnected } = useWeb3();

  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getContract = (withSigner) => {
    let _contract;
    if (withSigner) {
      _contract = new Contract(
        whitelistData.address,
        whitelistData.abi,
        signer
      );
      return _contract;
    }
    _contract = new Contract(
      whitelistData.address,
      whitelistData.abi,
      web3Provider
    );
    return _contract;
  };

  const addAddressToWhitelist = async () => {
    try {
      const _contract = getContract(true);

      setIsLoading(true);

      const tx = await _contract.addAddressToWhitelist();

      await tx.wait();

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const _contract = getContract();

      const _numberOFWhitelisted = await _contract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOFWhitelisted);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const _contract = getContract();

      const _joinedWhitelist = await _contract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };

  const readContractProperties = () => {
    checkIfAddressIsWhitelisted();
    getNumberOfWhitelisted();
  };

  useEffect(() => {
    if (isConnected) {
      readContractProperties();
    }
  });

  return {
    addAddressToWhitelist,
    isLoading,
    joinedWhitelist,
    numberOfWhitelisted,
  };
};
