import React from "react";
import Card from "../../components/ui/Card";
import { utils } from "ethers";
import { useIcoContract } from "../../hooks/web3-hooks";
import { useWeb3 } from "../../store/web3-context";

import MintTokenForm from "../../components/initial-coin-offering/MintTokenForm";
import ClaimTokenForm from "../../components/initial-coin-offering/ClaimTokenForm";
import WithdrawForm from "../../components/initial-coin-offering/WithdrawForm";
import AlertBanner from "../../components/ui/AlertBanner";

import ScaleLoader from "react-spinners/ScaleLoader";

const ICOPage = () => {
  const {
    tokensToBeClaimed,
    onMintTokens,
    tokensMinted,
    claimTokens,
    isLoading,
    isOwner,
  } = useIcoContract();
  const { isConnected } = useWeb3();

  return (
    <div className="h-full  flex justify-center items-center overflow-auto ">
      <div className="space-y-4 w-3/4">
        <h1 className="text-4xl font-bold text-white mb-8">
          Initital Coin Offering
        </h1>
        <div className="flex items-center justify-center">
          <ScaleLoader
            loading={isLoading}
            color="#F28C18"
            height={70}
            width={12}
          />
        </div>
        {isConnected && !isLoading ? (
          <div className="flex items-start space-x-4  ">
            {tokensToBeClaimed > 0 ? (
              <ClaimTokenForm
                claimTokens={claimTokens}
                tokensToBeClaimed={tokensToBeClaimed}
              />
            ) : (
              <MintTokenForm onMintTokens={onMintTokens} />
            )}
            <div className="w-full h-full space-y-4">
              <Card>
                <h2 className="text-white font-semibold text-xl">
                  Tokens minted:
                </h2>
                <p className="text-white">
                  {utils.formatEther(tokensMinted)}{" "}
                  <spa className="text-primary">/ 10000</spa>{" "}
                </p>
              </Card>
              {isOwner && <WithdrawForm />}
            </div>
          </div>
        ) : (
          !isConnected && <AlertBanner />
        )}
      </div>
    </div>
  );
};

export default ICOPage;
