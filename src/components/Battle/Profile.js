import React from 'react';
import PropTypes from 'prop-types';
import PlayerPreview from './PlayerPreview';

// stateless functional component
function Profile(props) {
  let info = props.info;
  return (
    <PlayerPreview username={info.name} avatar={info.name} info={info}></PlayerPreview>
  );
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
};

export default Profile;
