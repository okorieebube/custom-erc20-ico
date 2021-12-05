const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("LinkTokenCrowdsale", function () {
  before(async () => {
    [admin, investor1, investor2, investor3] = await ethers.getSigners();
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy(1000000);
    await linkToken.deployed();

    tokenPrice = 1000000000000000; //  in wei = 0.001 ETH
    LinkTokenCrowdsale = await ethers.getContractFactory("LinkTokenCrowdsale");
    linkCrowdSale = await LinkTokenCrowdsale.deploy(
      linkToken.address,
      tokenPrice
    );
    await linkCrowdSale.deployed();
    await linkToken.transfer(linkCrowdSale.address, 750000); // Transfer 75% of total supply to crowdsale
  });
  it("should setup crowdsale contract with correct values", async function () {
    expect(await linkCrowdSale.token()).to.not.equal(0x0);
    expect(await linkCrowdSale.tokenPrice()).to.equal(tokenPrice);
  });

  it("should sell tokens to investors", async function () {
    let numberOfTokens = 10;
    let x = BigNumber.from(numberOfTokens) * BigNumber.from( tokenPrice);
    // console.log(typeof x.toString());return;
    let txn = await linkCrowdSale.connect(investor1).buyTokens(numberOfTokens, {
      // value: BigNumber.from(numberOfTokens * Number(tokenPrice)),
      value: ethers.utils.formatEther(
        BigNumber.from(x)
      ),
    });
    let reciept = await txn.wait();

    // Triggers one event
    expect(reciept.events.length).to.equal(1);
    // Event triggered should be the Approval event
    expect(reciept.events[0].event).to.equal("Sell");
    // Event logs the correct required arguments
    expect(reciept.events[0].args._buyer).to.equal(investor1.address);
    expect(reciept.events[0].args._numberOfTokens).to.equal(100);
  });
});
