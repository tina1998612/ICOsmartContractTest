var Owned = artifacts.require("Owned");
var SNT = artifacts.require("SNT");
var StatusContribution = artifacts.require("StatusContribution");
var DynamicCeiling = artifacts.require("DynamicCeiling");
var SGTExchanger = artifacts.require("SGTExchanger");
var MiniMeToken = artifacts.require("MiniMeToken");
var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");

module.exports = function (deployer) {
  deployer.deploy(Owned);
  deployer.deploy(SNT);
  deployer.deploy(StatusContribution);
  deployer.deploy(DynamicCeiling);
  deployer.deploy(SGTExchanger);
  deployer.deploy(MiniMeToken);
  deployer.deploy(MiniMeTokenFactory);
};
