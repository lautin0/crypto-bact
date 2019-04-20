import React from 'react';
import PropTypes from 'prop-types';

class PlayerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ token: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(this.props.id, this.state.token);
  }

  componentDidMount() {
    let { token } = this.props;
    if (token != null) {
      this.setState({
        token: token
      })
    }
  }

  render() {
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="token">
          {this.props.label}
        </label>
        <input
          id="token"
          placeholder="token id"
          type="text"
          value={this.state.token}
          autoComplete="off"
          onChange={this.handleChange}
          disabled={this.props.disabled}
        />
        <button
          className="button"
          type="submit"
        >
          Confirm ID Token
        </button>
      </form>
    );
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

PlayerInput.defaultProps = {
  label: 'token'
};

export default PlayerInput;
