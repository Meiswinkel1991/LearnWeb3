import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ClaimTokenForm = (props) => {
  return (
    <Card>
      <h1 className="font-semibold text-lg text-white ">
        You {props.tokensToBeClaimed * 10} Tokens can be claimed!
      </h1>
      <Button onClick={props.claimTokens}>Claim !</Button>
    </Card>
  );
};

export default ClaimTokenForm;
