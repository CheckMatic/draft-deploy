import React from "react";
import CryptoJoinGame from "./joingame";
import CryptoChessGame from "../chess/ui/chessgame";
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
          <div>
            <h1
              style={{
                textAlign: "center",
                marginTop: String(window.innerHeight / 3) + "px",
              }}
            >
              Your Username:
            </h1>

            <input
              style={{
                marginLeft: String(window.innerWidth / 2 - 120) + "px",
                width: "240px",
                marginTop: "62px",
              }}
              ref={this.textArea}
              onInput={this.typingUserName}
            ></input>

            <button
              className="btn btn-primary"
              style={{
                marginLeft: String(window.innerWidth / 2 - 60) + "px",
                width: "120px",
                marginTop: "62px",
              }}
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
              Submit
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default CryptoJoinRoom;