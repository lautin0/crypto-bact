import React from 'react';
import { Button } from 'react-bootstrap';
import { updateAbility, getBacteriaTokenIdByAddress, parseAbility, levelUp } from "../../utils/api";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      dna: null,
      level: 0,
      readyTime: 0,
      winCount: 0,
      lossCount: 0,
      lethalityLevel: 0,
      airborneLevel: 0,
      activityLevel: 0,
      resistanceLevel: 0,
      upgradeDisable: true
    };

    this.onLevelUpClick = this.onLevelUpClick.bind(this);
    this.forceLevelUp = this.forceLevelUp.bind(this);
  }

  componentDidMount() {
    let profile = this.props.profile;

    let { lethalityLevel, airborneLevel, activityLevel, resistanceLevel } = parseAbility(profile.abilities)

    let upgradeDisable = (profile.level <= (lethalityLevel + airborneLevel + activityLevel + resistanceLevel));

    this.setState({
      name: profile.name,
      dna: profile.dna,
      level: profile.level,
      readyTime: profile.readyTime,
      winCount: profile.winCount,
      lossCount: profile.lossCount,
      lethalityLevel: lethalityLevel,
      airborneLevel: airborneLevel,
      activityLevel: activityLevel,
      resistanceLevel: resistanceLevel,
      upgradeDisable: upgradeDisable
    })
  }

  async forceLevelUp(){
    let { getCurrentAccount } = this.props;
    let web3 = window.web3;
    let bContract = window.bContract;
    let tokenId = await getBacteriaTokenIdByAddress(bContract, getCurrentAccount());
    levelUp(bContract, tokenId, getCurrentAccount(), web3)
    .then(function(tran){
      this.setState({
        level: tran.events.LevelUpBacteriaEvent.returnValues[0],
        upgradeDisable: false
      })
    }.bind(this));
  }

  async onLevelUpClick(type) {
    let { getCurrentAccount } = this.props;
    let bContract = window.bContract;
    let tokenId = await getBacteriaTokenIdByAddress(bContract, getCurrentAccount());
    let abilities
    if (type == "LET")
      abilities = "@@LET" + (this.state.lethalityLevel + 1) +
        "@@AIR" + this.state.airborneLevel +
        "@@ACT" + this.state.activityLevel +
        "@@RES" + this.state.resistanceLevel
    else if (type == "AIR")
      abilities = "@@LET" + this.state.lethalityLevel +
        "@@AIR" + (this.state.airborneLevel + 1) +
        "@@ACT" + this.state.activityLevel +
        "@@RES" + this.state.resistanceLevel
    else if (type == "ACT")
      abilities = "@@LET" + this.state.lethalityLevel +
        "@@AIR" + this.state.airborneLevel +
        "@@ACT" + (this.state.activityLevel + 1) +
        "@@RES" + this.state.resistanceLevel
    else if (type == "RES")
      abilities = "@@LET" + this.state.lethalityLevel +
        "@@AIR" + this.state.airborneLevel +
        "@@ACT" + this.state.activityLevel +
        "@@RES" + (this.state.resistanceLevel + 1)

    updateAbility(bContract, tokenId, abilities, getCurrentAccount())
      .then(function (tran) {
        let { lethalityLevel, airborneLevel, activityLevel, resistanceLevel } =
          parseAbility(tran.events.UpdateBacteriaEvent.returnValues[0])
        let upgradeDisable = (this.state.level <= (lethalityLevel + airborneLevel + activityLevel + resistanceLevel));
        this.setState({
          lethalityLevel: lethalityLevel,
          airborneLevel: airborneLevel,
          activityLevel: activityLevel,
          resistanceLevel: resistanceLevel,
          upgradeDisable: upgradeDisable
        })
      }.bind(this));
  }

  render() {
    return (
      <div className="profileInfo">
        <div className="profileLogo">
          {this.state.name && <img className="avatar" src={require('../../images/' + this.state.name + '.png')} alt={this.state.name} />}
          <br />
        </div>
        <div>
          <h3>{this.state.name}</h3>
        </div>
        <br />
        <div>
          <p>
            <i className="fa fa-dna" aria-hidden="true" /> DNA:{' '}
            {this.state.dna}
          </p>
          <p>
            <i className="fa fa-chart-bar" aria-hidden="true" /> Level:{' '}
            {this.state.level}
          </p>
          <p>
            <i className="fa fa-clock" aria-hidden="true" /> Ready Time:{' '}
            {this.state.readyTime}
          </p>
          <p>
            <i className="fa fa-crown" aria-hidden="true" /> Win Count:{' '}
            {this.state.winCount}
          </p>
          <p>
            <i className="fa fa-sad-cry" aria-hidden="true" /> Loss Count:{' '}
            {this.state.lossCount}
          </p>
          <p>
            Abilities:{' '}
          </p>

          <p>
            <Button disabled={this.state.upgradeDisable} variant="danger" onClick={() => this.onLevelUpClick("LET")}>
              <i className="fa fa-skull" aria-hidden="true" /> Lethality : {this.state.lethalityLevel}
            </Button>
          </p>
          <p>
            <Button disabled={this.state.upgradeDisable} variant="warning" onClick={() => this.onLevelUpClick("AIR")}>
              <i className="fa fa-plane" aria-hidden="true" /> Airborne : {this.state.airborneLevel}
            </Button>
          </p>
          <p>
            <Button disabled={this.state.upgradeDisable} variant="primary" onClick={() => this.onLevelUpClick("ACT")}>
              <i className="fa fa-thermometer-quarter" aria-hidden="true" /> Activity : {this.state.activityLevel}
            </Button>
          </p>
          <p>
            <Button disabled={this.state.upgradeDisable} variant="success" onClick={() => this.onLevelUpClick("RES")}>
              <i className="fa fa-shield-alt" aria-hidden="true" /> Resistance : {this.state.resistanceLevel}
            </Button>
          </p>
          <p>
            <Button variant="outline-warning" onClick={this.forceLevelUp}>
              <i className="fa fa-coins" aria-hidden="true" /> +1lv.(Ξ{window.levelUpFee})
            </Button>
          </p>
        </div>
      </div>
    );
  }
}

export default UserProfile;
