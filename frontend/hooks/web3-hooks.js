import { BigNumber, Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3 } from "../store/web3-context";
import {
  whitelistData,
  nftCollectionData,
  icoData,
} from "../store/contract-data";
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

export const useIcoContract = () => {
  const zero = BigNumber.from("0");

  const { signer, web3Provider, address, isConnected } = useWeb3();

  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [tokenBalance, setTokenBalance] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);

  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const getContract = (withSigner) => {
    let _contract;
    if (withSigner) {
      _contract = new Contract(icoData.address, icoData.abi, signer);
      return _contract;
    }
    _contract = new Contract(icoData.address, icoData.abi, web3Provider);
    return _contract;
  };

  /** Functions for Contract Interaction */

  const onMintTokens = async (amount) => {
    try {
      const _contract = getContract(true);

      const _value = amount * 0.001;
      console.log("mint tokens...");
      const tx = await _contract.mint(utils.parseEther(amount), {
        value: utils.parseEther(_value.toString()),
      });

      setIsLoading(true);
      await tx.wait();

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const claimTokens = async () => {
    try {
      const _contract = getContract(true);

      const tx = await _contract.claim();

      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const withdrawCoins = async () => {
    try {
      const _contract = getContract(true);

      const tx = await _contract.withdraw();
      setIsLoading(true);
      await tx.wait();

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  /** Contract View Functions */
  const getBalanceOfTokens = async () => {
    try {
      const _contract = getContract();

      const _balance = await _contract.balanceOf(address);

      setTokenBalance(_balance);
    } catch (e) {
      console.error(e);
      setTokenBalance(zero);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const _contract = getContract();

      const _tokensMinted = await _contract.totalSupply();

      setTokensMinted(_tokensMinted);
    } catch (e) {
      console.error(e);
      setTokensMinted(zero);
    }
  };

  const getTokensToBeClaimed = async () => {
    try {
      const _contract = getContract();

      const _nftContract = new Contract(
        nftCollectionData.address,
        nftCollectionData.abi,
        web3Provider
      );

      const _balance = await _nftContract.balanceOf(address);

      if (_balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        let amount = 0;

        for (let index = 0; index < _balance.toNumber(); index++) {
          const tokenId = await _nftContract.tokenOfOwnerByIndex(
            address,
            index
          );
          const claimed = await _contract.s_tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }

        setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (e) {
      console.error(e);
      setTokensToBeClaimed(zero);
    }
  };

  const getOwner = async () => {
    try {
      const _contract = getContract();

      const _owner = await _contract.owner();

      if (_owner.toLowerCase() === address.toLowerCase()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getTokensToBeClaimed();
      getBalanceOfTokens();
      getTotalTokensMinted();
      getOwner();
    }
  }, [web3Provider, address, isConnected, isLoading]);

  return {
    claimTokens,
    onMintTokens,
    tokensToBeClaimed,
    withdrawCoins,
    isLoading,
    isOwner,
    tokenBalance,
    tokensMinted,
  };
};

export const useNftCollection = () => {
  const { signer, web3Provider, address, isConnected } = useWeb3();

  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [nftBalance, setNftBalance] = useState(0);

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

  const startPresale = async () => {
    try {
      const _contract = getContract(true);

      const tx = await _contract.startPresale();
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      await checkIfPresaleStarted();
    } catch (e) {
      console.error(e);
    }
  };

  /** Fetching Contract Data Functions */
  const checkIfPresaleStarted = async () => {
    try {
      const _contract = getContract();
      const _presaleStarted = await _contract.s_presaleStarted();

      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      const _contract = getContract();

      const _presaleEnded = await _contract.s_presaleEnded();

      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (e) {
      console.error(e);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const _contract = getContract();

      const _tokenIds = await _contract.s_tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const getNftBalance = async () => {
    try {
      const _contract = getContract();

      const _balance = await _contract.balanceOf(address);

      setNftBalance(_balance.toNumber());
    } catch (e) {
      console.error(e);
      setNftBalance(0);
    }
  };

  const getOwner = async () => {
    try {
      const _contract = getContract();

      const _owner = await _contract.owner();

      if (_owner.toLowerCase() === address.toLowerCase()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getOwner();
      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }

      getTokenIdsMinted();
      getNftBalance();

      // Set an interval which gets called every 5 seconds to check presale has ended
      const presaleEndedInterval = setInterval(async () => {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async () => {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [address, isConnected]);

  return {
    presaleStarted,
    presaleEnded,
    tokenIdsMinted,
    isOwner,
    isLoading,
    publicMint,
    presaleMint,
    startPresale,
    nftBalance,
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
