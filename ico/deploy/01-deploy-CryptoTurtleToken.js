const { network } = require("hardhat");
const cryptoDevsData = require("../../nft-collection/deployments/mumbai/CryptoDevs.json");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [cryptoDevsData.address];

  log("--------------------------------------------------------");
  log("deploy nft crypto devs");
  await deploy("CryptoTurtleToken", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "token"];
