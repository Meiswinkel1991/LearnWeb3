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
    <div className="h-full  flex justify-center items-center overflow-auto">
      <div className="mx-4 space-y-4 mb-16">
        <h1 className=" text-4xl font-bold text-white ">
          Welcome to <span className="text-primary">MSW</span> Devs WhiteList
        </h1>
        <p className="text-white text-lg font-semibold">
          Its a Whitelist for the NFT MSW!
        </p>
        <p className="text-white text-lg font-semibold">
          You can now whitelisting your address and can mint the brand new NFT
          Tokens while Presale!!
        </p>
        <div className="border-2 rounded-xl  border-primary w-1/2 p-4">
          <p className=" text-white mb-2 text-semibold  ">
            <span className="text-primary text-xl">{numberOfWhitelisted} </span>
            people have already joined the Whitelist
          </p>
          {renderButton()}
        </div>
      </div>
    </div>
  );
};

export default WhiteList;
