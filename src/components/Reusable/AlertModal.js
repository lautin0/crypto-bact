import React from 'react';
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

class AlertModal extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = { 
        show: false,
        message: null,
        messageText: null
      };

      this.handleHide = this.handleHide.bind(this);
    }

    handleHide(){
      this.setState({ show: false });
    }

    componentDidUpdate(){
      let { type, data, show } = this.props;    

      let message = []
      let msgText = ""
  
      if(type == "attack"){
        message.push("You bacteria has been attacked! ");
        message.push("Attacker Address: " + data.attacker)
        message.push("Attacking Bacteria: " + data.atkName)
        message.push("Defending Bacteria: " + data.defName) 
        message.push("Result: " + data.result)
        msgText = "Attacker Address: " + data.attacker + 
          "Attacking Bacteria: " + data.atkName +
          "Defending Bacteria: " + data.defName +
          "Result: " + data.result;
      }
      else if(type == "create"){
        msgText = "A new bacteria was born! Token: " + data.bacteriaId + ", Name: "+ data.name + ", DNA: " + data.dna;
        message.push(msgText);
      }
        
      if(show && msgText !== this.state.messageText)this.setState({ show: true, message: message, messageText: msgText });
    }

    render() {
      let modalClose = () => this.setState({show: false})
      return (
        <Modal show={this.state.show} onHide={modalClose} centered>
          <Modal.Header closeButton>Incoming Message</Modal.Header>
          <Modal.Body>
            {this.state.message && this.state.message.map((value, index)=>{
              return(
              <p key={index}>{value}<br/></p>
              )
            })}
          </Modal.Body>
          <Modal.Footer>
              <Button onClick={this.handleHide} variant="primary">
                Ok
              </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }

  export default AlertModal;