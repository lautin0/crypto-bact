import React from 'react';
import PropTypes from 'prop-types';
import { parseAbility } from "../../utils/api";
import { Button } from 'react-bootstrap';

var styles = {
  display: "inline"
}
function PlayerPreview(props) {
  let { lethalityLevel, airborneLevel, activityLevel, resistanceLevel } = parseAbility(props.info.abilities)
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={require('../../images/' + props.username + '.png')}
          alt={'Avatar for ' + props.username}
        />
      </div>
      <ul className="space-list-items">
        <li>Name: {props.info.name}</li>
        <li>DNA: {props.info.dna}</li>
        <li>Level: {props.info.level}</li>
        <li>Win Count: {props.info.winCount}</li>
        <li>Lose Count: {props.info.lossCount}</li>
        <li>
          <Button style={styles} variant="danger" disabled><i className="fa fa-skull" aria-hidden="true" />{lethalityLevel}</Button>
          <Button style={styles} variant="warning" disabled><i className="fa fa-plane" aria-hidden="true" />{airborneLevel}</Button>
          <Button style={styles} variant="primary" disabled><i className="fa fa-thermometer-quarter" aria-hidden="true" />{activityLevel}</Button>
          <Button style={styles} variant="success" disabled><i className="fa fa-shield-alt" aria-hidden="true" />{resistanceLevel}</Button>
        </li>
      </ul>
    </div>
  );
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

export default PlayerPreview;
