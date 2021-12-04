const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LinkTokenCrowdsale", function () {
  before(async () => {
    [admin, investor1, investor2, investor3] = await ethers.getSigners();
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy(1000000);
    await linkToken.deployed();
    
    LinkTokenCrowdsale = await ethers.getContractFactory("LinkTokenCrowdsale");
    crowdSale = await LinkTokenCrowdsale.deploy();
    await crowdSale.deployed();
  });
  it("should setup token contract with correct values", async function () {
    expect(await linkToken.name()).to.equal("Link Token");
    expect(await linkToken.symbol()).to.equal("LINK");
  });
})