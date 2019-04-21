import React from 'react';
import { Button } from 'react-bootstrap';
import { getAccounts } from '../../utils/api';

//import { TweenMax } from 'gsap';

import animate from '@jam3/gsap-promise';
import { findDOMNode } from 'react-dom';

class Home extends React.Component {

  constructor(props){
    super(props)
    this.fetchAllAccounts = this.fetchAllAccounts.bind(this);

    this.state = {
      allAccounts: null
    }
  }

  componentDidMount() {
    animate.from(this.header, 0.2, { y: -200, delay: 0.1 });
    animate.from(this.button, 0.3, {
      x: -1200,
      opacity: 0.5,
      delay: 0.2
    });
  }

  async fetchAllAccounts(){
    var accounts = await getAccounts(window.web3)
    this.setState({
      allAccounts: accounts
    })
  }

  render() {
    let {setCurrentAccount, getCurrentAccount} = this.props
    return (
      <div className="home-container">
        <h1 ref={c => (this.header = c)}>
          Crypto-bact Home
        </h1>
        <label>Current Account: {getCurrentAccount()}</label>
        <Button ref={l => (this.button = findDOMNode(l))} variant="info" onClick={this.fetchAllAccounts}>Fetch Accounts</Button>
        <br/>
        <label>Quick Switch Account</label>
        <br/>
        {this.state.allAccounts != null && this.state.allAccounts.map((account, index)=>{
          return(
            <Button key={index} onClick={() => setCurrentAccount(account)} variant="light">{account}</Button>
          )
        })}
      </div>
    );
  }
}

export default Home;
