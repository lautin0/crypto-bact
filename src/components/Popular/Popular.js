import React from 'react';
import SelectLanguage from './SelectLanguage';
import RepoGrid from './RepoGrid';
import { getBacteriaTokenIdByAddress, getNumOfBacteriaList, getAllBacteriasCount } from '../../utils/api';
import Loading from '../Reusable/Loading';

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All', // default state
      repos: null,
      currentTokenId: null
    };

    // Explicit bound
    // New function where this function is bind to this keyword
    this.updateLanguage = this.updateLanguage.bind(this);
    // make the this inside the updateLanguage() is bound to the state

    this.fetchBacterias = this.fetchBacterias.bind(this);
    this.getCurrentTokenId = this.getCurrentTokenId.bind(this);
  }

  getCurrentTokenId(){
    return this.state.currentTokenId
  }

  async fetchBacterias(){
    let bContract = window.bContract;
    let count = await getAllBacteriasCount(bContract);
    getNumOfBacteriaList(bContract, count).then(function(bacterias){
      this.setState(function(){
        return { repos: bacterias};
      });
    }.bind(this));

    let { getCurrentAccount } = this.props;
    let account = getCurrentAccount();
    if(account){
      let tokenId = await getBacteriaTokenIdByAddress(bContract, account);
      this.setState({
        currentTokenId: tokenId
      })
    }
  }

  async componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);

    
    this.fetchBacterias();
  }

  updateLanguage(lang) {
    this.setState({
      selectedLanguage: lang,
      repos: null
    });

    this.fetchBacterias();
  }

  /* With arrow function you don't need to pass to .map() a second argument .this because it already binds */

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />

        {//don't call it until repos are loaded
        !this.state.repos ? (
          <Loading speed={250} />
        ) : (
          <RepoGrid repos={this.state.repos} getCurrentTokenId={this.getCurrentTokenId} getCurrentAccount={this.props.getCurrentAccount}/>
        )}
      </div>
    );
  }
}

export default Popular;
