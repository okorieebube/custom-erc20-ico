const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LinkToken", function () {
  before(async () => {
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy(1000000);
    await linkToken.deployed();
  });
  it("Should return the token total supply", async function () {
    expect(await linkToken.totalSupply()).to.equal(1000000);
  });
});
