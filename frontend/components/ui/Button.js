import React from "react";

const Button = (props) => {
  return (
    <button
      className="bg-primary border-2 border-primary text-white px-2 py-1 rounded-xl text-lg font-semibold hover:text-primary hover:bg-base-100 duration-300 "
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
