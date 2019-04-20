pragma solidity ^0.5.2;

import "./ownable.sol";
import "./safemath.sol";

contract BacteriaFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewBacteria(uint bacteriaId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 30 seconds;

  struct Bacteria {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
    string abilities;
  }

  Bacteria[] public bacterias;

  mapping (uint => address) public bacteriaToOwner;
  mapping (address => uint) ownerBacteriaCount;
  
  function getBacteriaAt(uint idx) public view returns (string memory, uint, uint32, uint32, uint16, uint16, string memory){
      if(idx < bacterias.length){
          return (
              bacterias[idx].name,
              bacterias[idx].dna,
              bacterias[idx].level,
              bacterias[idx].readyTime,
              bacterias[idx].winCount,
              bacterias[idx].lossCount,
              bacterias[idx].abilities
          );
      }
  }
  
  function getAllBacteriaCount() public view returns (uint){
    return bacterias.length;
  }

  function _createBacteria(string memory _name, uint _dna) internal {
    string memory temp = "@@LET1@@AIR0@@ACT0@@RES0";
    uint id = bacterias.push(Bacteria(_name, _dna, 1, uint32(now + cooldownTime), 0, 0, temp)) - 1;
    bacteriaToOwner[id] = msg.sender;
    ownerBacteriaCount[msg.sender] = ownerBacteriaCount[msg.sender].add(1);
    emit NewBacteria(id, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomBacteria(string memory _name) public {
    require(ownerBacteriaCount[msg.sender] == 0);
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createBacteria(_name, randDna);
  }

}
