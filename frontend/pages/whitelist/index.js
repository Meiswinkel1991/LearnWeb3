import React from "react";

import { useWhitelistDapp } from "../../hooks/web3-hooks";
import { useWeb3 } from "../../store/web3-context";

import Button from "../../components/ui/Button";
import ConnectionButton from "../../components/layout/ConnectionButton";

const WhiteList = () => {
  const { addAddressToWhitelist, joinedWhitelist, numberOfWhitelisted } =
    useWhitelistDapp();
  const { isConnected } = useWeb3();

  const renderButton = () => {
    if (!isConnected) {
      return (
        <div>
          <p className="text-white mb-4">
            You are not connected with your wallet!!!
          </p>
          <ConnectionButton />
        </div>
      );
    }

    if (!joinedWhitelist) {
      return <Button onClick={addAddressToWhitelist}>Join Whitelist</Button>;
    }

    if (joinedWhitelist) {
      return (
        <p className="text-white">You are already joined the Whitelist!!</p>
      );
    }
  };

  return (
    <div className="w-full h-full shrink  flex justify-center items-center overflow-auto mt-8">
      <div className="mx-4 space-y-4 mb-16">
        <h1 className=" text-4xl font-bold text-white ">
          Welcome to <span className="text-primary">Crypto</span> Devs
        </h1>
        <p className="text-white text-lg font-semibold">
          Its an NFT collection for developers in Crypto.
        </p>
        <div className="border-t-2  border-primary" />
        <p className=" text-white  ">
          <span className="text-primary text-xl">{numberOfWhitelisted} </span>
          people have already joined the Whitelist
        </p>
        {renderButton()}
      </div>
    </div>
  );
};

export default WhiteList;
