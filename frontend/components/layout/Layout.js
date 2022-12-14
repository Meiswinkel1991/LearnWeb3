import React from "react";
import Head from "next/head";
import Image from "next/image";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  return (
    <div
      className=" w-screen h-screen 
    bg-base-100  "
    >
      <Head>
        <title>Web 3 DApps</title>
        <meta name="description" content="Web 3 Project Showcase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full container flex flex-col w-full my-0 mx-auto p-0">
        <MainNavigation />
        <main className="flex-grow">{props.children}</main>
      </div>
    </div>
  );
};

export default Layout;
