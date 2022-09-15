import React from "react";
import Image from "next/image";
import { useWeb3 } from "../../store/web3-context";
import { useNativeBalance } from "../../hooks/web3-hooks";
import { FaWallet, FaShoppingBag } from "react-icons/fa";

const ConnectionButton = () => {
  const { connect, address, isConnected, disconnect } = useWeb3();
  const { balance } = useNativeBalance();

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
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => disconnect()}
            className=" border-2 border-primary  px-2 py-1 rounded-xl text-lg font-semibold text-primary bg-base-100 duration-300  "
          >
            {address &&
              `${address.slice(0, 6)}...${address.slice(
                address.length - 4,
                address.length
              )}`}
          </button>
          <FaWallet size={32} className="text-primary h-12" />
          <div className=" inline-block items-center text-center ">
            <div className="self-center ">
              <Image
                src="/crypto-symbols/matic.svg"
                alt="matic symbol"
                width={15}
                height={15}
              />
            </div>
            <h2 className="text-primary  ">{parseFloat(balance).toFixed(4)}</h2>
          </div>

          {/* <div className=" inline-block items-center text-center ">
            <div className="self-center ">
              <FaShoppingBag size={15} className="text-primary" />
            </div>
            <h2 className="text-primary  ">{parseFloat(balance).toFixed(4)}</h2>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ConnectionButton;
