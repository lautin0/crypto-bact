pragma solidity ^0.5.2;

import "./bacteriahelper.sol";

contract BacteriaAttack is BacteriaHelper {
  uint randNonce = 0;
  uint attackVictoryProbability = 70;

  event BacteriaAttackEvent(address attacker, string atkName, address indexed defender, string defName, string result);
  event BacteriaReturnEvent(uint atkToken, uint defToken, bool wl);

  function randMod(uint _modulus) internal returns(uint) {
    randNonce = randNonce.add(1);
    return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
  }

  function attack(uint _bacteriaId, uint _targetId) external onlyOwnerOf(_bacteriaId) returns (uint, uint, bool){
    Bacteria storage myBacteria = bacterias[_bacteriaId];
    require(_isReady(myBacteria));
    Bacteria storage enemyBacteria = bacterias[_targetId];
    string memory wl = "";
    bool wlBool;
    uint rand = randMod(100);
    wlBool = rand <= attackVictoryProbability;
    if (wlBool) {
      myBacteria.winCount = myBacteria.winCount.add(1);
      myBacteria.level = myBacteria.level.add(1);
      enemyBacteria.lossCount = enemyBacteria.lossCount.add(1);
      wl = "loss";
      //feedAndMultiply(_bacteriaId, enemyBacteria.dna, "bacteria");
    } else {
      myBacteria.lossCount = myBacteria.lossCount.add(1);
      enemyBacteria.winCount = enemyBacteria.winCount.add(1);
      _triggerCooldown(myBacteria);
      wl = "win";
    }
    emit BacteriaAttackEvent(bacteriaToOwner[_bacteriaId], myBacteria.name, bacteriaToOwner[_targetId], enemyBacteria.name, wl);
    emit BacteriaReturnEvent(_bacteriaId, _targetId, wlBool);
    return (_bacteriaId, _targetId, wlBool);
  }
}
