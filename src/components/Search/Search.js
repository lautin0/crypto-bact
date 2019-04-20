import React from 'react';
import UserProfile from './UserProfile';
import PropTypes from 'prop-types';
import { createBacteria,getBacteriaByAddress } from '../../utils/api';
import Loading from '../Reusable/Loading';
import animate from '@jam3/gsap-promise';
import { withRouter } from 'react-router' 
import AppConstants from '../../utils/appconstants'


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userInfo: '',
      userRepos: '',
      loading: false,
      bacteria: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getBacteriaByPlayer(bContract, account){
    getBacteriaByAddress(bContract, account).then(bact => {
        if(bact.dna === undefined || bact.dna === 0)
          this.setState({
            bacteria: {
              name: bact[AppConstants.FIELD_NAME],
              dna: bact[AppConstants.FIELD_DNA],
              level: bact[AppConstants.FIELD_LEVEL],
              readyTime: bact[AppConstants.FIELD_READYTIME],
              lossCount: bact[AppConstants.FIELD_LOSSCOUNT],
              winCount: bact[AppConstants.FIELD_WINCOUNT],
              abilities: bact[AppConstants.FIELD_ABILITIES]
            }
          })
        else
          this.setState({bacteria: null})
      }
    );    
  }

  componentDidMount() {
    let { bContract, getCurrentAccount} = this.props
    animate.from(this.label, 0.2, { y: -200, delay: 0.1 });
    animate.from(this.input, 0.3, {
      x: -1200,
      opacity: 0.5,
      delay: 0.2
    });
    animate.from(this.button, 0.3, {
      x: -1200,
      opacity: 0.5,
      delay: 0.2
    });
    let account = getCurrentAccount()
    if(account == null)
      this.setState({bacteria: null})
    else
      this.getBacteriaByPlayer(bContract, account);
  }

  handleChange(event) {
    this.setState({ user: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    let { bContract, getCurrentAccount} = this.props
    this.setState({
      user: null,
      userInfo: '',
      userRepos: '',
      loading: true
    });

    let account = getCurrentAccount()
    createBacteria(bContract, this.state.user, account);   

    this.getBacteriaByPlayer(bContract, account);

    this.setState({
      loading: false
    });
  }

  render() {
    let { loading, bacteria } = this.state;
    return (
      <div>
        <form className="column centered" onSubmit={this.handleSubmit} style={{display: (this.state.bacteria != null && this.state.bacteria.dna == 0) ? '' : 'none' }}>
          <label ref={c => (this.label = c)} className="header" htmlFor="user">
            Enter a name for your first bacteria
          </label>
          <input
            ref={l => (this.input = l)}
            id="user"
            type="text"
            placeholder="Bacteria Name"
            autoComplete="off"
            onChange={this.handleChange}
          />
          <button
            ref={z => (this.button = z)}
            className="button"
            type="submit"
            disabled={!this.state.user}
          >
            Create
          </button>
        </form>

        <div className="profile">
          {loading ? <Loading speed={250} /> : ' '}
          {(bacteria && bacteria.dna != 0) && <UserProfile profile={bacteria} bContract={this.props.bContract} getCurrentAccount={this.props.getCurrentAccount} />}
        </div>

        <div className="row" style={{display: (this.state.bacteria == null ? '' : 'none')}}>
          <h3 style={{color: 'red'}}>Please Login First</h3>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  user: PropTypes.string,
  userInfo: PropTypes.object,
  userRepos: PropTypes.object,
  bContract: PropTypes.object.isRequired
};

export default withRouter(Search);
