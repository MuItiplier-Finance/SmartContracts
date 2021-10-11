const YieldContract = artifacts.require("YieldContract");
const Tether = artifacts.require("Tether");
const VeChain = artifacts.require("VeChain");
const ChainLink = artifacts.require("ChainLink");
const HuobiToken = artifacts.require("HuobiToken");
const BasicAttentionToken = artifacts.require("BasicAttentionToken");

module.exports = function(deployer) {
    deployer.deploy(YieldContract,"10000000000000000")
      .then(function () {
        return deployer.deploy(Tether);
      })
      .then(function () {
        return deployer.deploy(VeChain);
      })
      .then(function () {
        return deployer.deploy(ChainLink);
      })
      .then(function () {
        return deployer.deploy(HuobiToken);
      })
      .then(function () {
        return deployer.deploy(BasicAttentionToken);
      });
};
