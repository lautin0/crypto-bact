import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import animate from '@jam3/gsap-promise';

// stateless functional component
class RepoGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: this.props
    };
  }

  componentDidMount() {
    animate.staggerFrom(
      '.popular-item',
      0.5,
      {
        x: -1500,
        opacity: 0.5,
        delay: 0.2
      },
      0.035
    );
  }
  render() {
    let repos = this.state.repos;
    let { getCurrentTokenId, getCurrentAccount } = this.props
    return (
      <ul className="popular-list">
        {repos.repos.map((repo, index) => {
          return (
            <li
              key={index}
              //className={`popular-item ${index % 2 ? 'to-right' : 'to-left'}`}
              className="popular-item"
            >
              <div className="popular-rank">#{index + 1}</div>
              <ul className="space-list-items">
                <li>
                  <img
                    className="avatar"
                    src={require('../../images/' + repo.name + '.png')}
                    alt={`Avatar for ${repo.name}`}
                  />
                </li>

                <li>
                  <a target="_blank">
                    {repo.name}
                  </a>
                </li>
                <li>@{repo.readyTime}</li>
                <li>DNA : {repo.dna}</li>
                <li>{repo.winCount} Wins</li>
                <li>{repo.lossCount} Losses</li>
                <li>       
                  {(getCurrentAccount() != null ? 
                  (<Link
                    className="button"
                    to={getCurrentTokenId() == index ? {pathname: "/lab"} :{pathname: "/battle/"+repo.token}}
                  >
                    {getCurrentTokenId() == index ? "To Lab" : "Battle"}
                  </Link>) : <div style={{display: "none"}}></div>)
                  }
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

export default RepoGrid;
