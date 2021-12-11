import React from "react";
import CryptoJoinGame from "./joingame";
import CryptoChessGame from "../chess/ui/chessgame";
import background from 'img/varying-stripes.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";

const socket = require("../connection/socket").socket;

/**
 * Onboard is where we create the game room.
 */

class CryptoJoinRoom extends React.Component {
  state = {
    didGetUserName: false,
    inputText: "",
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  typingUserName = () => {
    // grab the input text from the field from the DOM
    const typedText = this.textArea.current.value;

    // set the state with that text
    this.setState({
      inputText: typedText,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.didGetUserName ? (
          <React.Fragment>
            <CryptoJoinGame userName={this.state.inputText} isCreator={false} />
            <CryptoChessGame myUserName={this.state.inputText} />
          </React.Fragment>
        ) : (
          <div style={{backgroundImage: `url(${background})`}}>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="text-center">How does it work?</Accordion.Header>
                    <Accordion.Body>
                    <p style={{color: "black", fontWeight: "400", textAlign: "left"}}>
                🔗 Enter Username<br></br>
                🎮 Stake Your $MATIC<br></br>
                💲 Play the Game<br></br>
                👑 Winners Take it All
              </p>
                </Accordion.Body>
                </Accordion.Item>
                </Accordion>
            <h1
              style={{
                textAlign: "center",
                marginTop: String(window.innerHeight / 3) + "px",
              }}
            >
              Enter Your Coolest Name!
            </h1>

            <input
              style={{border:"0",borderBottom:"2px solid lightgrey",padding:"10px",background:"#f7f7f7",marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px", borderColor:"#a7a7a7"}}

              ref={this.textArea}
              onInput={this.typingUserName}
            ></input>

            <button
              className="btn btn-primary"
              style = {{"border":"1px solid #e8e8e8","color":"black","padding":"0.7em 1.7em","fontSize":"18px","borderRadius":"0.2em","background":"#e8e8e8","transition":"all .3s","boxShadow":"6px 6px 12px #c5c5c5,\n             -6px -6px 12px #ffffff",marginBottom:"100px",marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px", 
                        "button_active":{"boxShadow":"4px 4px 12px #c5c5c5,\n -4px -4px 12px #ffffff"}, }}
              disabled={!(this.state.inputText.length > 0)}
              onClick={() => {
                // When the 'Submit' button gets pressed from the username screen,
                // We should send a request to the server to create a new room with
                // the uuid we generate here.
                this.setState({
                  didGetUserName: true,
                });
                socket.on("boardNumber", (data) => {
                  // alert(data);
                  console.log(data);
                });
              }}
            >
              Play!
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default CryptoJoinRoom;
