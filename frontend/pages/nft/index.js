import React from "react";
import { useNftCollection } from "../../hooks/web3-hooks";
import { useWeb3 } from "../../store/web3-context";

import Button from "../../components/ui/Button";
import ConnectionButton from "../../components/layout/ConnectionButton";

const NFT = () => {
  const {
    presaleEnded,
    presaleStarted,
    presaleMint,
    publicMint,
    isLoading,
    isOwner,
    tokenIdsMinted,
  } = useNftCollection();

  const { isConnected } = useWeb3();

  const renderButton = () => {
    if (!isConnected) {
      <ConnectionButton />;
    }
    if (isOwner && !presaleStarted) {
      <Button>Start Presale!</Button>;
    }
  };

  return (
    <div className="h-full  flex justify-center items-center overflow-auto">
      <div>
        <h1 className="text-4xl font-bold text-white">NFT Collection</h1>
        <p className="text-white">Coming soon...</p>
      </div>
    </div>
  );
};

export default NFT;
