const SneakerAuth = artifacts.require("SneakerAuth");

module.exports = function(deployer) {
  deployer.deploy(SneakerAuth);
};
