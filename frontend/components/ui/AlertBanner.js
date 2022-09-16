import React from "react";

const AlertBanner = () => {
  return (
    <div className="flex p-4 mb-4 text-sm text-white bg-error rounded-lg">
      <h2 className="font-medium">
        <span className="text-lg ">Not Connected !!</span> Please connect your
        wallet to the website.
      </h2>
    </div>
  );
};

export default AlertBanner;
