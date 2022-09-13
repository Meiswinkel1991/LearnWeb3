import React from "react";
import { useWeb3 } from "../../store/web3-context";
import { FaWallet } from "react-icons/fa";

const ConnectionButton = () => {
  const { connect, address, isConnected, disconnect } = useWeb3();

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="bg-primary border-2 border-primary text-white px-2 py-1 rounded-xl text-lg font-semibold hover:text-primary hover:bg-base-100 duration-300  "
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={() => disconnect()}
          className="bg-primary border-2 border-primary text-white px-2 py-1 rounded-xl text-lg font-semibold hover:text-primary hover:bg-base-100 duration-300  "
        >
          {address}
        </button>
      )}
    </div>
  );
};

export default ConnectionButton;
