import Web3 from 'web3'; 
import abi from '../components/Reusable/abi'
import AppConstants from '../utils/appconstants'

export function battle(bContract, players, sender) {
  return bContract.methods.attack(players[0], players[1]).send({
    from: sender,
    gasPrice: 3000000,
    gas: 3000000
  })
}

export function updateAbility(bContract, bactToken, abilities, sender){
  return bContract.methods.changeAbility(bactToken, abilities).send({
    from: sender,
    gasPrice: 3000000,
    gas: 3000000
  })
}

export function initializeWeb3Provider(){
  var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  var _address = '0xbfc60ac4f5aa705c9a09948eb0b5fb84b556ebc7';
  var bContract = new web3.eth.Contract(abi, _address);
  return {
    web3: web3,
    bContract: bContract
  }
}

export async function getAccounts(web3){
  var accounts = await web3.eth.getAccounts().then();
  return accounts;
}

export function createBacteria(bContract,name,acc){
  bContract.methods.createRandomBacteria(name).send({
    from: acc,
    gasPrice: 3000000,
    gas: 3000000
  })
}

export async function getBacteriaByTokenId(bContract, token){
  let bact = await bContract.methods.getBacteriaAt(token).call().then();
  return {
    token: token,
    name: bact[AppConstants.FIELD_NAME],
    dna: bact[AppConstants.FIELD_DNA],
    level: bact[AppConstants.FIELD_LEVEL],
    readyTime: bact[AppConstants.FIELD_READYTIME],
    lossCount: bact[AppConstants.FIELD_LOSSCOUNT],
    winCount: bact[AppConstants.FIELD_WINCOUNT],
    abilities: bact[AppConstants.FIELD_ABILITIES]
  };
}

export async function getOwnerOfBacteriaByToken(bContract, tokenId){
  let address =  await bContract.methods.ownerOf(tokenId).call().then();
  return address;
}

export async function getBacteriaTokenIdByAddress(bContract, address){
  let tokenId =  await bContract.methods.getBacteriaTokenIdByAddress(address).call().then();
  return tokenId;
}

export async function getAllBacteriasCount(bContract){
  return bContract.methods.getAllBacteriaCount().call();
}

export function getBacteriaByAddress(bContract,account){
  return bContract.methods.getBacteriasByOwner(account).call();
}

export function getNumOfBacteriaList(bContract,num){
    let promiseArray = [];
    for (let i = 0; i < num; i++) {
      promiseArray.push(bContract.methods.getBacteriaAt(i).call());
    }
    return Promise.all(promiseArray).then(function(values){
      var bactArray = [];
      for (let index = 0; index < values.length; index++) {
        var bacteria = values[index];
        var item = {
          token: index,
          name: bacteria[AppConstants.FIELD_NAME],
          dna: bacteria[AppConstants.FIELD_DNA],
          level: bacteria[AppConstants.FIELD_LEVEL],
          readyTime: bacteria[AppConstants.FIELD_READYTIME],
          lossCount: bacteria[AppConstants.FIELD_LOSSCOUNT],
          winCount: bacteria[AppConstants.FIELD_WINCOUNT],
          abilities: bacteria[AppConstants.FIELD_ABILITIES]
        }
        bactArray.push(item)
      }
      return bactArray;
    });
}

export function parseAbility(ability) {
  let lethalityIdx = ability.indexOf("@@LET");
  let airborneIdx = ability.indexOf("@@AIR");
  let activityIdx = ability.indexOf("@@ACT");
  let resistanceIdx = ability.indexOf("@@RES");

  let lethalityLevel = parseInt(ability.substring(lethalityIdx + 5, airborneIdx))
  let airborneLevel = parseInt(ability.substring(airborneIdx + 5, activityIdx))
  let activityLevel = parseInt(ability.substring(activityIdx + 5, resistanceIdx))
  let resistanceLevel = parseInt(ability.substring(resistanceIdx + 5, ability.length))

  return ({
    lethalityLevel: lethalityLevel,
    airborneLevel: airborneLevel,
    activityLevel: activityLevel,
    resistanceLevel: resistanceLevel
  })
}