import React from 'react';
import PropTypes from 'prop-types';
import Profile from './Profile';
import win from '../../images/win.png'
import lose from '../../images/lose.png'

// stateless functional component
function Player(props) {
  var styles = {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${props.win?win:lose})`,
    backgroundSize: "50%"
  }
  return (
    <div style={styles}>
      <h1 className="header">{props.label}</h1>
      <h3 style={{ textAlign: 'center' }}>Name: {props.name}</h3>
      <Profile info={props.info}></Profile>
    </div>
  );
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Player;
