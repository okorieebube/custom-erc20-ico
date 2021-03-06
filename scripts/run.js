const hre = require("hardhat");

async function main() {
  const [admin, investor1, investor2, investor3] = await ethers.getSigners();
  const LinkToken = await ethers.getContractFactory("LinkToken");
  const linkToken = await LinkToken.deploy("1000000000000000000000000");
  await linkToken.deployed();
  console.log("Token deployed to:", linkToken.address);

  const tokenPrice = "1000000000000000"; //  in wei = 0.001 ETH
  const LinkTokenCrowdsale = await ethers.getContractFactory(
    "LinkTokenCrowdsale"
  );
  const linkCrowdSale = await LinkTokenCrowdsale.deploy(
    linkToken.address,
    tokenPrice
  );
  await linkCrowdSale.deployed();
  console.log("Crowdsale deployed to:", linkCrowdSale.address);

  await linkToken.transfer(linkCrowdSale.address, "750000000000000000000000"); // Transfer 75% of total supply to crowdsale
  console.log(
    "Transferred",
    await linkToken.balanceOf(linkCrowdSale.address),
    " to crowdsale"
  );
  console.log("Admins Link Balance:", await linkToken.balanceOf(admin.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
