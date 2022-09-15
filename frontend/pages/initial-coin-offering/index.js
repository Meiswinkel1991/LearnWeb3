import React from "react";
import { useIcoContract } from "../../hooks/web3-hooks";

import MintTokenForm from "../../components/initial-coin-offering/MintTokenForm";

const ICOPage = () => {
  const { tokensToBeClaimed } = useIcoContract();

  return (
    <div className="h-full  flex justify-center items-center overflow-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Intital Coin Offering</h1>
        <MintTokenForm />
      </div>
    </div>
  );
};

export default ICOPage;
