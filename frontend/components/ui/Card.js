import React from "react";

const Card = (props) => {
  return (
    <div className="bg-neutral rounded-xl  w-full shadow-xl py-4 px-4 ">
      {props.children}
    </div>
  );
};

export default Card;
