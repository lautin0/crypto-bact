import React from 'react';
import queryString from 'query-string';
import { battle } from '../../utils/api';
import { Link } from 'react-router-dom';
import Player from './Player';
import Loading from '../Reusable/Loading';
import { getBacteriaByTokenId } from '../../utils/api'

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    };
  }

  componentDidMount() {
    let players;
    players = queryString.parse(this.props.location.search);
    let { getCurrentAccount } = this.props;
    battle(this.props.bContract, [players.playerOneToken, players.playerTwoToken], getCurrentAccount())
      .then(function (tran) {
        let atkToken = tran.events.BacteriaReturnEvent.returnValues[0]
        let defToken = tran.events.BacteriaReturnEvent.returnValues[1]
        let result = tran.events.BacteriaReturnEvent.returnValues[2]
        Promise.all([getBacteriaByTokenId(this.props.bContract, atkToken),
        getBacteriaByTokenId(this.props.bContract, defToken)]).then(function (values) {
          let winnerBact;
          let loserBact;
          winnerBact = result ? values[0] : values[1]
          loserBact = result ? values[1] : values[0]
          this.setState(function () {
            return {
              error: null,
              winner: winnerBact,
              loser: loserBact,
              loading: false
            };
          });
        }.bind(this))
      }.bind(this));
  }

  render() {
    let { winner, loser, error, loading } = this.state;

    if (loading == true) {
      return <Loading speed={200} />;
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      );
    }

    return (
      <div className="row">
        <Player label="Winner" name={winner.name} info={winner} win={true}/>
        <Player label="Loser" name={loser.name} info={loser} win={false}/>
      </div>
    );
  }
}

export default Results;
