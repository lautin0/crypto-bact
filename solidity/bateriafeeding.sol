pragma solidity ^0.5.2;

import "./bacteriafactory.sol";

contract BacteriaFeeding is BacteriaFactory {


  modifier onlyOwnerOf(uint _bacteriaId) {
    require(msg.sender == bacteriaToOwner[_bacteriaId]);
    _;
  }

  function _triggerCooldown(Bacteria storage _bacteria) internal {
    _bacteria.readyTime = uint32(now + cooldownTime);
  }

  function _isReady(Bacteria storage _bacteria) internal view returns (bool) {
      return (_bacteria.readyTime <= now);
  }

}
