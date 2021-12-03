//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract LinkToken {
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    constructor(uint256 _initalSupply) {
        balanceOf[msg.sender] = _initalSupply;
        totalSupply = _initalSupply;
    }
}
