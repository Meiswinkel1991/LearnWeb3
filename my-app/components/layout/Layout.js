import Head from "next/head";

const Layout = (props) => {
  return (
    <div className=" bg-primary h-screen  ">
      <Head>
        <title>Esti Trade App</title>
        <meta
          name="description"
          content="App for price prediction on blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container w-full ">
        {/* <Header /> */}
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
