const UserAuthentication = artifacts.require("UserAuthentication");

module.exports = async function(deployer) {
  // Deploy the UserAuthentication contract to the blockchain
  await deployer.deploy(UserAuthentication);
};