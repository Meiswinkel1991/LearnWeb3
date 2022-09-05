import Link from "next/link";

import ConnectionButton from "../web3/ConnectionButton";

const styles = {
  wrapper: "flex justify-around text-jellygrey items-center p-4",
  logo: "text-4xl font-bold text-transparent  bg-clip-text bg-gradient-to-r from-jellyblue to-jellypink",
  menu: "flex  rounded-xl bg-secondary text-white  ",
  menuBtn:
    "py-1 px-2 mx-2 my-2 hover:text-jellypink/50 rounded-xl text-xl box-content border-2 border-secondary ",
};

const Header = ({ connect }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>LearnWeb3 </div>
      <div className={styles.menu}>
        <button className={styles.menuBtn}>
          <Link href="/">Home</Link>
        </button>
        <button className={styles.menuBtn}>
          <Link href="/">WhiteList Dapp</Link>
        </button>
        <button className={styles.menuBtn}>
          <Link href="/">Dashboard</Link>
        </button>
        <button className={styles.menuBtn}>
          <Link href="/">More</Link>
        </button>
      </div>
      <ConnectionButton connect={connect} />
    </div>
  );
};

export default Header;
