//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;
import "./LinkToken.sol";

/* 
    send a percentage of the token to token sale contract
    set token price in wei
    assign an admin
    buy tokens
    end sale 
*/

contract LinkTokenCrowdsale {
    address admin;
    LinkToken public token;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(LinkToken _token, uint256 _tokenPrice) {
        admin = msg.sender;
        token = _token;
        tokenPrice = _tokenPrice;
    }

    event Sell(address _buyer, uint256 _numberOfTokens);

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(
            msg.value == multiply(_numberOfTokens, tokenPrice),
            "Error: msg.value must equal number of tokens in wei"
        );
        require(
            token.balanceOf(address(this)) >= _numberOfTokens,
            "Error: You can't buy more tokens than available!"
        );
        require(token.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, "Error! only admin can end crowdsale");
        require(token.transfer(admin, token.balanceOf(address(this))));

        // payable(admin).transfer(address(this).balance);

        (bool sent, ) = payable(admin).call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
    }
}
