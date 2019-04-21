pragma solidity ^0.5.2;

import "./bacteriafeeding.sol";

contract BacteriaHelper is BacteriaFeeding {

  uint levelUpFee = 0.001 ether;

  modifier aboveLevel(uint _level, uint _bacteriaId) {
    require(bacterias[_bacteriaId].level >= _level);
    _;
  }
  
  event UpdateBacteriaEvent(string abilities);
  event LevelUpBacteriaEvent(uint level);
  event levelUpFeeUpdatedEvent(uint fee);

  function withdraw() external onlyOwner {
    address payable _owner = owner();
    _owner.transfer(address(this).balance);
  }

  function setLevelUpFee(uint _fee) external onlyOwner {
    levelUpFee = _fee;
    emit levelUpFeeUpdatedEvent(levelUpFee);
  }
  
  function getLevelUpFee() external view returns (uint) {
    return levelUpFee;
  }

  function levelUp(uint _bacteriaId) external payable {
    require(msg.value == levelUpFee);
    bacterias[_bacteriaId].level = bacterias[_bacteriaId].level.add(1);
    emit LevelUpBacteriaEvent(bacterias[_bacteriaId].level);
  }

  function changeName(uint _bacteriaId, string calldata _newName) external aboveLevel(2, _bacteriaId) onlyOwnerOf(_bacteriaId) {
    bacterias[_bacteriaId].name = _newName;
  }
  
  function changeAbility(uint _bacteriaId, string calldata _newAbility) external onlyOwnerOf(_bacteriaId) {
    bacterias[_bacteriaId].abilities = _newAbility;
    emit UpdateBacteriaEvent(bacterias[_bacteriaId].abilities);
  }

  function changeDna(uint _bacteriaId, uint _newDna) external aboveLevel(20, _bacteriaId) onlyOwnerOf(_bacteriaId) {
    bacterias[_bacteriaId].dna = _newDna;
  }

  function getBacteriasByOwner(address _owner) external view returns (string memory, uint, uint32, uint32, uint16, uint16, string memory){
    uint idx = 999;
    for (uint i = 0; i < bacterias.length; i++) {
      if (bacteriaToOwner[i] == _owner) {
        idx = i;
      }
    }
    return getBacteriaAt(idx);
  }
  
  function getBacteriaTokenIdByAddress(address _owner) external view returns (uint256){
    for (uint i = 0; i < bacterias.length; i++) {
      if (bacteriaToOwner[i] == _owner) {
        return i;
      }
    }
  }
}
