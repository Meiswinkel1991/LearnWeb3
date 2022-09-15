import React from "react";
import Link from "next/link";

import ConnectionButton from "./ConnectionButton";
import NavListItems from "./NavLinks";

const navLinks = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/whitelist",
    name: "WhiteList Dapp",
  },
  {
    path: "/nft",
    name: "NFT Collection",
  },
  {
    path: "/initial-coin-offering",
    name: "Initial Coin Offering",
  },
];

const MainNavigation = () => {
  return (
    <nav className="flex items-center justify-between mx-4 pt-2">
      <div className="text-white text-4xl font-semibold font-sans tracking-tighter">
        Learn Web <span className="text-primary">3</span>
      </div>
      <ul className="flex space-x-4 text-white ">
        {navLinks.map((navLink, index) => {
          return (
            <NavListItems name={navLink.name} path={navLink.path} key={index} />
          );
        })}
      </ul>
      <ConnectionButton />
    </nav>
  );
};

export default MainNavigation;
