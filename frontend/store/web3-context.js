import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const providerOptions = {};

const Web3Context = createContext({
  provider: null,
  web3Provider: null,
  signer: null,
  address: null,
  isConnected: false,
  chainId: 0,
  connect: async () => {},
  disconnect: async () => {},
});

export function Web3ContextProvider(props) {
  const web3ModalRef = useRef();

  const [provider, setProvider] = useState();

  const [web3Provider, setWeb3Provider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState();

  const [isConnected, setIsConnected] = useState(false);

  const getProviderData = async () => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const _provider = await web3ModalRef.current.connect();

    const _web3Provider = new ethers.providers.Web3Provider(_provider);

    const _network = await _web3Provider.getNetwork();

    const _chainId = _network.chainId;

    const _signer = _web3Provider.getSigner();
    const _address = await _signer.getAddress();

    if (_address) {
      setIsConnected(true);
    }

    setProvider(_provider);
    setWeb3Provider(_web3Provider);
    setChainId(_chainId);
    setSigner(_signer);
    setAddress(_address);
  };

  const connect = useCallback(async () => {
    console.log("try to connect...");
    // web3ModalRef.current = new Web3Modal({
    //   network: "mumbai", // optional
    //   cacheProvider: true, // optional
    //   providerOptions, // required
    //   disableInjectedProvider: false,
    // });

    await getProviderData();
  }, []);

  const disconnect = useCallback(async () => {
    //TODO: Check if the disconnect is correct
    console.log("try to disconnect...");
    await web3ModalRef.current.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === "function") {
      await provider.disconnect();
    }
  }, [provider]);

  // Auto connect to the cached provider
  useEffect(() => {
    console.log("refresh page");
    if (!web3ModalRef.current) {
      console.log("reconnect");
      web3ModalRef.current = new Web3Modal({
        network: "mumbai", // optional
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false,
      });
    }
    console.log(web3ModalRef.current.cacheProvider);
    if (!isConnected && web3ModalRef.current.cacheProvider) {
      console.log("reconnect!!!");
      connect();
    }
  });

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged", accounts);
        getProviderData();
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        console.log("chain is changed!", _hexChainId);

        getProviderData();
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
    web3Provider: web3Provider,
    signer: signer,
    address: address,
    isConnected: isConnected,
    chainId: chainId,
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
