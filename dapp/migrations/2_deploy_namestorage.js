const NameStorage = artifacts.require("NameStorage");

module.exports = function (deployer) {
  deployer.deploy(NameStorage);
}; 