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
    startPresale,
  } = useNftCollection();

  const { isConnected } = useWeb3();

  const renderButton = () => {
    if (!isConnected) {
      return <ConnectionButton />;
    }
    if (isOwner && !presaleStarted) {
      return <Button onClick={startPresale}>Start Presale!</Button>;
    }

    if (!presaleEnded && presaleStarted) {
      return <Button onClick={presaleMint}>Mint NFT</Button>;
    }

    if (presaleEnded && presaleStarted) {
      return <Button onClick={publicMint}>Mint NFT</Button>;
    }

    return null;
  };

  const renderText = () => {
    if (presaleStarted && !presaleEnded) {
      return (
        <p className="text-white">
          The Presale is ongoing. Mint your NFT if you&apos;re whitelisted
        </p>
      );
    }

    if (presaleEnded && presaleStarted) {
      return (
        <p className="text-white">Claime one of the 20 most popular NFTs!!</p>
      );
    }

    return null;
  };

  return (
    <div className="h-full  flex justify-center items-center overflow-auto">
      <div className="space-y-4 ">
        <h1 className="text-4xl font-bold text-white">NFT Collection</h1>
        {renderText()}
        {renderButton()}
        <div className="border-2 border-primary " />
        <div className="grid grid-cols-2 gap-2 items-center">
          <p className="text-white">Total Amount of minted MSW tokens: </p>
          <p className="text-primary font-bold text-xl">
            {tokenIdsMinted}
            <span className="text-white ml-2">/ 20</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFT;
