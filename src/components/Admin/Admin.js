import React from 'react'
import animate from '@jam3/gsap-promise';
import { onlyOwnerSetLevelUpFee } from '../../utils/api'
import { Button } from 'react-bootstrap';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelUpFee: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
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
  }

  handleChange(event) {
    this.setState({ levelUpFee: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { setLevelUpFee } = this.props
    onlyOwnerSetLevelUpFee(window.bContract, window.web3.utils.toWei(this.state.levelUpFee), this.props.getCurrentAccount())
      .then(function (tran) {
        let fee = window.web3.utils.fromWei(tran.events.levelUpFeeUpdatedEvent.returnValues[0])
        this.setState({
          levelUpFee: fee
        })
        setLevelUpFee(fee);
      }.bind(this))
  }

  componentWillMount() {
    this.setState({
      levelUpFee: this.props.levelUpFee
    })
  }

  render() {
    return (
      <div>
        <form className="column centered" onSubmit={this.handleSubmit} >
          <label ref={c => (this.label = c)} className="header" htmlFor="user">
            Change level-up fee
            </label>
          <input
            ref={l => (this.input = l)}
            id="user"
            type="text"
            placeholder="New Fee(Ξ)"
            autoComplete="off"
            onChange={this.handleChange}
            value={this.state.levelUpFee}
          />
          <Button
            variant="outline-danger"
            ref={z => (this.button = z)}
            type="submit"
          ><i className="fa fa-tools" aria-hidden="true" /> Update
          </Button>
        </form>
      </div>
    )
  }
}

export default Admin;