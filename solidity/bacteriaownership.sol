pragma solidity ^0.5.2;

import "./bacteriaattack.sol";
import "./erc721.sol";
import "./safemath.sol";

contract BacteriaOwnership is BacteriaAttack, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) bacteriaApprovals;

  function balanceOf(address _owner) external view returns (uint256) {
    return ownerBacteriaCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return bacteriaToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerBacteriaCount[_to] = ownerBacteriaCount[_to].add(1);
    ownerBacteriaCount[msg.sender] = ownerBacteriaCount[msg.sender].sub(1);
    bacteriaToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
      require (bacteriaToOwner[_tokenId] == msg.sender || bacteriaApprovals[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
    }

  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
      bacteriaApprovals[_tokenId] = _approved;
      emit Approval(msg.sender, _approved, _tokenId);
    }

}
