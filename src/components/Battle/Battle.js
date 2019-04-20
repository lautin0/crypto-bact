import React from 'react';
import PlayerInput from './PlayerInput';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getBacteriaByTokenId, getBacteriaTokenIdByAddress } from '../../utils/api'
import animate from '@jam3/gsap-promise';
import { findDOMNode } from 'react-dom';

function PlayerPreview(props) {
  return (
    <div>
      <div className="column">
        <img src={props.avatar} alt={props.username} className="avatar" />
        <h2 className="username">@{props.username}</h2>
      </div>
      <button className="reset" onClick={props.onReset.bind(null, props.id)}>
        Reset
      </button>
    </div>
  );
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null,
      playerOneToken: null,
      playerTwoToken: null,
      currentBactToken: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    this.first && animate.from(this.first, 0.4, {
      x: 2200,
      opacity: 0.5,
      delay: 0.2
    });
    this.second && animate.from(this.second, 0.4, {
      x: -2200,
      opacity: 0.5,
      delay: 0.2
    });
  }

  async handleSubmit(id, token) {
    let { getCurrentAccount } = this.props;
    let bact;
    if(token == ''){
      let tokenId = await getBacteriaTokenIdByAddress(this.props.bContract, getCurrentAccount());    
      bact = await getBacteriaByTokenId(this.props.bContract, tokenId)
      bact.token = tokenId;
    }else{
      bact = await getBacteriaByTokenId(this.props.bContract, token)
      bact.token = token;
    }

    this.setState(function() {
      var newState = {};
      newState[id + 'Name'] = bact.name;
      newState[id + 'Image'] = require('../../images/' + bact.name + '.png')
      newState[id + 'Token'] = bact.token;
      return newState;
    });
  }

  handleReset(id) {
    this.setState(function() {
      var newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
      newState[id + 'Token'] = null;
      return newState;
    });
  }

  render() {
    let {
      playerOneName,
      playerTwoName,
      playerOneImage,
      playerTwoImage,
      playerOneToken,
      playerTwoToken
    } = this.state;

    let match = this.props.match;
    let { getCurrentAccount } = this.props
    let account = getCurrentAccount()
    return (
      <div>
        <div className="row">
        {!account && (<h3 style={{color: "red"}}>Please Login First</h3>)}
          {(account != null && !playerOneName) && (
            <PlayerInput
              ref={a => (this.first = findDOMNode(a))}
              id="playerOne"
              label="Friendly"
              onSubmit={this.handleSubmit}
              token={this.state.currentBactToken}
              disabled = {true}
            />
          )}

          {(account != null && playerOneImage !== null) && (
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id="playerOne"
            />
          )}

          {(account != null && !playerTwoName) && (
            <PlayerInput
              ref={b => (this.second = findDOMNode(b))}
              id="playerTwo"
              label="Enemy"
              onSubmit={this.handleSubmit}
              token={match.params.token}
              disabled = {false}
            />
          )}

          {(account != null && playerTwoImage !== null) && (
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id="playerTwo"
            />
          )}
        </div>
        {playerOneImage &&
        playerTwoImage && (
          <Link
            className="button"
            to={{
              pathname: "../battle/results",
              search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}&playerOneToken=${playerOneToken}&playerTwoToken=${playerTwoToken}`
            }}
          >
            Battle
          </Link>
        )}
      </div>
    );
  }
}

export default Battle;
