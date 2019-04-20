pragma solidity ^0.5.2;

import "./bacteriafactory.sol";

contract KittyInterface {
  function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
  );
}

contract BacteriaFeeding is BacteriaFactory {

  KittyInterface kittyContract;

  modifier onlyOwnerOf(uint _bacteriaId) {
    require(msg.sender == bacteriaToOwner[_bacteriaId]);
    _;
  }

  function setKittyContractAddress(address _address) external onlyOwner {
    kittyContract = KittyInterface(_address);
  }

  function _triggerCooldown(Bacteria storage _bacteria) internal {
    _bacteria.readyTime = uint32(now + cooldownTime);
  }

  function _isReady(Bacteria storage _bacteria) internal view returns (bool) {
      return (_bacteria.readyTime <= now);
  }

  function feedAndMultiply(uint _bacteriaId, uint _targetDna, string memory _species) internal onlyOwnerOf(_bacteriaId) {
    Bacteria storage myBacteria = bacterias[_bacteriaId];
    require(_isReady(myBacteria));
    _targetDna = _targetDna % dnaModulus;
    uint newDna = (myBacteria.dna + _targetDna) / 2;
    if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
      newDna = newDna - newDna % 100 + 99;
    }
    _createBacteria("NoName", newDna);
    _triggerCooldown(myBacteria);
  }

  function feedOnKitty(uint _bacteriaId, uint _kittyId) public {
    uint kittyDna;
    (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
    feedAndMultiply(_bacteriaId, kittyDna, "kitty");
  }
}
