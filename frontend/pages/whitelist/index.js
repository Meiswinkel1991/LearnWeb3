import React from "react";

import { useWhitelistDapp } from "../../hooks/web3-hooks";
import { useWeb3 } from "../../store/web3-context";

import Button from "../../components/ui/Button";

const WhiteList = () => {
  const { addAddressToWhitelist, joinedWhitelist } = useWhitelistDapp();
  const { isConnected } = useWeb3();

  return (
    <div className="w-full h-full shrink  flex justify-center items-center overflow-auto mt-8">
      <div className="mx-4 space-y-4 mb-16">
        <h1 className=" text-4xl font-bold text-white ">
          Welcome to <span className="text-primary">Crypto</span> Devs
        </h1>
        <p className="text-white text-lg font-semibold">
          Its an NFT collection for developers in Crypto.
        </p>
        {joinedWhitelist ? <p>You are already joined the Whitelist</p> : ""}
        <Button onClick={addAddressToWhitelist}>Join Whitelist</Button>
      </div>
    </div>
  );
};

export default WhiteList;
