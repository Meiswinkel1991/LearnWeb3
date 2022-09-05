const { ethers, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const maxNumberWhitelistedAddresses = 10;

  const args = [maxNumberWhitelistedAddresses];

  log("deploy whitelist");
  await deploy("WhiteList", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "whitelist"];
