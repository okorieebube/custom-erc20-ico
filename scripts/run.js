
const hre = require("hardhat");

async function main() {
  const LinkToken = await hre.ethers.getContractFactory("LinkToken");
  const linkToken = await LinkToken.deploy();

  await linkToken.deployed(1000000);

  console.log("linkToken deployed to:", linkToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
