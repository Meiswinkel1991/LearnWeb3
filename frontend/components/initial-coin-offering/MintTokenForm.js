import React, { useRef } from "react";
import Button from "../../components/ui/Button";

const MintTokenForm = (props) => {
  const tokenAmountInputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredTokenAmount = tokenAmountInputRef.current.value;

    props.onMintTokens(enteredTokenAmount);
  };

  return (
    <div className="bg-neutral rounded-xl mx-auto w-full shadow-xl py-4 px-4">
      <form className="space-y-4 mx-4">
        <h1 className="text-2xl font-bold text-white">
          Mint your Crypto Turtle Tokens
        </h1>
        <div className="flex flex-col mb-4 space-y-4">
          <label className="font-bold text-primary" htmlFor="tokenAmount">
            Amount of Tokens
          </label>
          <input
            className="bg-base-100 text-lg text-white pb-4 border-0  rounded-2xl focus:ring-4 focus:outline-none focus:ring-primary focus:text-primary pl-2 pt-2"
            type="number"
            id="tokenAmounts"
            required
            ref={tokenAmountInputRef}
          />
        </div>
        <Button>Mint Tokens</Button>
      </form>
    </div>
  );
};

export default MintTokenForm;
