const { network } = require("hardhat");
const whitelistData = require("../../whitelist-dapp/deployments/mumbai/WhiteList.json");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const BASE_URI = "https://nft-collection-sneh1999.vercel.app/api/";
  console.log(whitelistData);
  const WHITELIST_ADDRESS = whitelistData.address;
  const SYMBOL = "MSW";
  const NAME = "MSW DevToken";

  const args = [BASE_URI, WHITELIST_ADDRESS, NAME, SYMBOL];

  log("--------------------------------------------------------");
  log("deploy nft crypto devs");
  await deploy("CryptoDevs", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "nft"];
