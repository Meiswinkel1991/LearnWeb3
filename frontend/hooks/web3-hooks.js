import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3 } from "../store/web3-context";
import { whitelistData } from "../store/contract-data";

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
      console.log(address);
      console.log(_contract);
      const _joinedWhitelist = await _contract.whitelistedAddresses(address);
      console.log(_joinedWhitelist);
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
