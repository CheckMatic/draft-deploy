import React from "react";
import { Redirect } from "react-router-dom";
import uuid from "uuid/v4";
import { ColorContext } from "components/context/colorcontext";
const socket = require("../connection/socket").socket;

/**
 * Onboard is where we create the game room.
 */

class CryptoCreateNewGame extends React.Component {
  state = {
    didGetUserName: false,
    inputText: "",
    gameId: "",
    boardNumber: "",
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  getBoardNumber = () => {
    var decoded_cookie = decodeURIComponent(document.cookie);
    var ca = decoded_cookie.split(";");

    var boardNumber = "";
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf("boardNumber") == 0) {
        boardNumber = c.substring(12, c.length);
      }
    }
    this.setState({
      boardNumber: boardNumber,
    });

    socket.emit("boardNumber", boardNumber);

    return boardNumber;
  };

  send = () => {
    const newGameRoomId = uuid();
    this.setState({
      gameId: newGameRoomId,
    });
    socket.emit("createNewGame", newGameRoomId);
  };

  typingUserName = () => {
    const typedText = this.textArea.current.value;
    this.setState({
      inputText: typedText,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.didGetUserName ? (
          <Redirect to={"/crypto/" + this.state.gameId}>
            <button
              className="btn btn-success"
              style={{
                marginLeft: String(window.innerWidth / 2 - 60) + "px",
                width: "120px",
              }}
            >
              Start Game
            </button>
          </Redirect>
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
                this.props.didRedirect();
                this.getBoardNumber();
                this.props.setUserName(this.state.inputText);
                this.setState({
                  didGetUserName: true,
                });
                socket.on("boardNumber", (data) => {
                  // alert(data);
                  console.log(data);
                });
                this.send();
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

const CryptoOnboard = (props) => {
  const color = React.useContext(ColorContext);

  return (
    <CryptoCreateNewGame
      didRedirect={color.playerDidRedirect}
      setUserName={props.setUserName}
    />
  );
};

export default CryptoOnboard;
