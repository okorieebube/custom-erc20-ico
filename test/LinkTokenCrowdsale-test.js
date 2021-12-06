const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("LinkTokenCrowdsale", function () {
  before(async () => {
    [admin, investor1, investor2, investor3] = await ethers.getSigners();
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy(1000000);
    await linkToken.deployed();

    tokenPrice = "1000000000000000"; //  in wei = 0.001 ETH
    LinkTokenCrowdsale = await ethers.getContractFactory("LinkTokenCrowdsale");
    linkCrowdSale = await LinkTokenCrowdsale.deploy(
      linkToken.address,
      tokenPrice
    );
    await linkCrowdSale.deployed();
    await linkToken.transfer(linkCrowdSale.address, 750000); // Transfer 75% of total supply to crowdsale

    console.log(await linkToken.balanceOf(admin.address))
  });
  it("should setup crowdsale contract with correct values", async function () {
    expect(await linkCrowdSale.token()).to.not.equal(0x0);
    expect(await linkCrowdSale.tokenPrice()).to.equal(tokenPrice);
  });

  it("should sell tokens to investors", async function () {
    let numberOfTokens = "100";
    let x = numberOfTokens * tokenPrice;
    let txn = await linkCrowdSale.connect(investor1).buyTokens(numberOfTokens, {
      value: x.toString(),
    });
    let reciept = await txn.wait();

    // Triggers one event
    expect(reciept.events.length).to.equal(2);
    // Event triggered should be the Approval event
    expect(reciept.events[1].event).to.equal("Sell");
    // Event logs the correct required arguments
    expect(reciept.events[1].args._buyer).to.equal(investor1.address);
    expect(reciept.events[1].args._numberOfTokens).to.equal(100);
    // Should increment crowdsales no of tokens sold
    expect(await linkCrowdSale.tokensSold()).to.equal(100);
    // should increment buyers token balance
    expect(await linkToken.balanceOf(investor1.address)).to.equal(100);

    await expect(
      linkCrowdSale.connect(investor1).buyTokens(numberOfTokens, {
        value: "10000",
      })
    ).to.be.revertedWith("Error: msg.value must equal number of tokens in wei");

    await expect(
      linkCrowdSale.connect(investor1).buyTokens("900000", {
        value: ("900000" * tokenPrice).toString(),
      })
    ).to.be.revertedWith("Error: You can't buy more tokens than available!");
  });

  it("should end token crowdsale", async function () {
    await expect(linkCrowdSale.connect(investor1).endSale()).to.be.revertedWith(
      "Error! only admin can end crowdsale"
    );
    await linkCrowdSale.connect(admin).endSale();
    // Ensure the remaining tokens after sale are transferred to the admin
    expect(await linkToken.balanceOf(admin.address)).to.equal(1000000 - 100);

    expect(await ethers.provider.getBalance(linkCrowdSale.address)).to.equal(0);
  });
});
