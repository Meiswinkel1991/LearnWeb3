import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const WithdrawForm = () => {
  return (
    <Card>
      <h2 className="text-white text-xl font-semibold">Withdraw The Funds</h2>
      <p className="text-white mb-2">
        A total of <span className="text-primary">22 Matic</span> are deposit.
      </p>
      <Button>Withdraw Funds</Button>
    </Card>
  );
};

export default WithdrawForm;
