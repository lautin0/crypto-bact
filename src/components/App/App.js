import React from 'react';
//import ReactRouter from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Battle from '../Battle/Battle';
import Results from '../Battle/Results';
import Popular from '../Popular/Popular';
import Search from '../Search/Search';
import { initializeWeb3Provider } from '../../utils/api';

class App extends React.Component {
  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props);

    this.setCurrentAccount = this.setCurrentAccount.bind(this);
    this.setAccounts = this.setAccounts.bind(this);
    this.getCurrentAccount = this.getCurrentAccount.bind(this);
    this.getBacteriaContract = this.getBacteriaContract.bind(this);

    // Set the state directly. Use props if necessary.
    this.state = {
      web3: null,
      bContract: null,
      currentAccount: null,
      allAccounts: null,
      loadingComplete: false,
      levelUpFee: 0
    }
  }

  setCurrentAccount(account) {
    this.setState({
      currentAccount: account
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

  getBacteriaContract() {
    return this.state.bContract;
  }

  componentDidMount() {
    this.setState({ ...initializeWeb3Provider() });
  }

  render() {
    return (
      <Router>
        <div className="container">
          <Nav bContract={this.state.bContract} getCurrentAccount={this.getCurrentAccount} />
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} setCurrentAccount={this.setCurrentAccount}
              currentAccount={this.state.currentAccount} web3={this.state.web3} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle" render={(props) => <Battle {...props} bContract={this.state.bContract} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle/results" render={(props) => <Results {...props} bContract={this.state.bContract} getCurrentAccount={this.getCurrentAccount} />} />
            <Route exact path="/battle/:token" render={(props) => <Battle {...props} bContract={this.state.bContract} getCurrentAccount={this.getCurrentAccount} />} />
            <Route path="/popular" render={(props) => <Popular {...props} bContract={this.state.bContract} getCurrentAccount={this.getCurrentAccount} />} />
            <Route path="/lab" render={(props) => <Search {...props} bContract={this.state.bContract}
              getCurrentAccount={this.getCurrentAccount} web3={this.state.web3} />} />
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
