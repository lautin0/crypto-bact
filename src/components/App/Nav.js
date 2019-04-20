import React from 'react';
import { NavLink } from 'react-router-dom';
import AlertModal from '../Reusable/AlertModal';

class Nav extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: false,
      data: null,
      type: null,
      linkTo: null
    }
  }

  render() {
    let { bContract, getCurrentAccount } = this.props

    bContract && bContract.events
      .BacteriaAttackEvent({ filter: { defender: getCurrentAccount() } })
      .on("data", function (event) {
        let bact = event.returnValues;
        // We can access this event's return values on the `event.returnValues` object:
        if (getCurrentAccount()) {
          if (bact.attacker !== getCurrentAccount() && bact.defender === getCurrentAccount()) {
            console.log(getCurrentAccount() + ", " + bact.attacker)
            this.setState({
              data: bact,
              show: true,
              type: "attack",
              linkTo: {}
            })
          }
        }
      }.bind(this)).on("error", console.error);

    //subscribe event
    bContract && bContract.events.NewBacteria()
      .on("data", function (event) {
        let bact = event.returnValues;
        // We can access this event's return values on the `event.returnValues` object:
        this.setState({
          data: bact,
          show: true,
          type: "create"
        })
      }.bind(this)).on("error", console.error);

    return (
      <div>
        <AlertModal type={this.state.type} data={this.state.data} show={this.state.show}></AlertModal>
        <ul className="nav">
          <li>
            <NavLink exact activeClassName="active" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/battle">
              Battle
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/popular">
              Arena
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/lab">
              Lab
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default Nav;
