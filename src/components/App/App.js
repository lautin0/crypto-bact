import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Battle from '../Battle/Battle';
import Results from '../Battle/Results';
import Popular from '../Popular/Popular';
import Search from '../Search/Search';
import Admin from '../Admin/Admin'
import { initializeWeb3Provider, getLevelUpFee, isOwner } from '../../utils/api';

class App extends React.Component {
  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props);

    this.setCurrentAccount = this.setCurrentAccount.bind(this);
    this.setAccounts = this.setAccounts.bind(this);
    this.getCurrentAccount = this.getCurrentAccount.bind(this);
    this.setLevelUpFee = this.setLevelUpFee.bind(this);

    // Set the state directly. Use props if necessary.
    this.state = {
      currentAccount: null,
      allAccounts: null,
      loadingComplete: false,
      levelUpFee: 0,
      isOwner: false
    }
  }

  setLevelUpFee(fee){
    this.setState({
      levelUpFee: fee
    })
    window.levelUpFee = fee;
  }

  setCurrentAccount(account) {
    this.setState({
      currentAccount: account
    })
    isOwner(window.bContract, account).then((result) => {
      this.setState({
        isOwner: result
      })
    })
  }

  setAccounts(accounts) {
    this.setState({
      allAccounts: accounts
    })
  }

  getCurrentAccount() {
    return this.state.currentAccount;
  }

  componentWillMount() {
    let { web3, bContract } = initializeWeb3Provider()
    window.bContract = bContract;
    window.web3 = web3;
    getLevelUpFee(bContract).then((result) => { 
      let eth = web3.utils.fromWei(result)
      window.levelUpFee = eth
      this.setState({
        levelUpFee: eth
      })
     });
  }

  render() {
    return (
      <Router>
        <div className="container">
          <Nav isOwner={this.state.isOwner} getCurrentAccount={this.getCurrentAccount} />
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} setCurrentAccount={this.setCurrentAccount}
              currentAccount={this.state.currentAccount} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle" render={(props) => <Battle {...props} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle/results" render={(props) => <Results {...props} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle/:token" render={(props) => <Battle {...props} getCurrentAccount={this.getCurrentAccount} />} />
            <Route path="/popular" render={(props) => <Popular {...props} getCurrentAccount={this.getCurrentAccount} />} />
            <Route path="/lab" render={(props) => <Search {...props} getCurrentAccount={this.getCurrentAccount} />} />
            <Route path="/admin" render={(props) => <Admin {...props} getCurrentAccount={this.getCurrentAccount} 
            levelUpFee={this.state.levelUpFee} setLevelUpFee={this.setLevelUpFee}></Admin>}  ></Route>
            <Route
              render={function () {
                return <p>Not Found</p>;
              }}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
