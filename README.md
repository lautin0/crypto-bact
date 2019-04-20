# crypto-bact

### 1. Setup local blockchain to test rpc
```bash
npm install ganache-cli
ganache-cli
```
By default, it listens port 8545.

### 2. Deploy smart contracts

Visit https://remix.ethereum.org/

### 3. Copy contract ABI, paste into /components/Reusable/abi.js
```javascript
var abi = //<<paste the contract abi here>>

export default abi;
```

### 4. Change contract address in /util/api.js
```javascript
export function initializeWeb3Provider(){
  var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  
  var _address = //<<contract address string>>;
  
  var bContract = new web3.eth.Contract(abi, _address);
  return {
    web3: web3,
    bContract: bContract
  }
}
```

### 5. Start DApp
```bash
yarn start
```
