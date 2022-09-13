import { createContext, useContext, useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const providerOptions = {};

const Web3Context = createContext({
  provider: null,
  web3Provider: null,
  signer: null,
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
});

export function Web3ContextProvider(props) {
  const web3ModalRef = useRef();

  const [provider, setProvider] = useState();

  const web3Provider = useRef();
  const signer = useRef();
  const address = useRef();

  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    console.log("try to connect...");
    web3ModalRef.current = new Web3Modal({
      network: "mumbai", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      disableInjectedProvider: false,
    });

    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const _provider = await web3ModalRef.current.connect();

    web3Provider.current = new ethers.providers.Web3Provider(_provider);

    signer.current = web3Provider.current.getSigner();
    address.current = await signer.current.getAddress();

    if (address.current) {
      setIsConnected(true);
    }

    setProvider(_provider);
  };

  const disconnect = async () => {
    //TODO: Check if the disconnect is correct
    console.log("try to disconnect...");
    await web3ModalRef.current.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === "function") {
      await provider.disconnect();
    }
  };

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged", accounts);
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        console.log("chain is changed!");
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  });

  const context = {
    provider: provider,
    web3Provider: web3Provider.current,
    signer: signer.current,
    address: address.current,
    isConnected: isConnected,
    connect: connect,
    disconnect: disconnect,
  };

  return (
    <Web3Context.Provider value={context}>
      {props.children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);

  return context;
}
