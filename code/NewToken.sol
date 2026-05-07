// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Jotudela42Token is ERC20 {

  address public owner; //Bonus

  constructor (uint256 initialSupply) ERC20("Jotudela42Token", "JT42T"){
    owner = msg.sender; //Bonus
    _mint(msg.sender, initialSupply);
  }
  
  //Bonus
  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  function transferOwnership(address newOwner) external onlyOwner {
    owner = newOwner;
  }

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }

  function transferToken(address to, uint256 amount) external onlyOwner {
    transfer(to, amount);
  }

  function burnToken(address to, uint256 amount) external onlyOwner {
    _burn(to, amount);
  }

}