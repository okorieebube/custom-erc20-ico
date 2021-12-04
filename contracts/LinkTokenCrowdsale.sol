//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
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

    constructor(LinkToken _token, uint256 _tokenPrice) {
        admin = msg.sender;
        token = _token;
        tokenPrice = _tokenPrice;
    }
}
