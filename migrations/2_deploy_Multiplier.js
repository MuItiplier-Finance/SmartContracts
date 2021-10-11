
const Multiplier = artifacts.require("Multiplier");

module.exports = function(deployer) {
    deployer
      .deploy(Multiplier);
};
