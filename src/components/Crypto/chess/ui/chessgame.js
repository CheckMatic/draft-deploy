import React, { useEffect, useState, createRef } from "react";
import Game from "../model/chess";
import Square from "../model/square";
import { Stage, Layer } from "react-konva";
import Board from "../assets/chessBoard.png";
import useSound from "use-sound";
import chessMove from "../assets/moveSoundEffect.mp3";
import Piece from "./piece";
import piecemap from "./piecemap";
import { useParams } from "react-router-dom";
import { ColorContext } from "components/context/colorcontext";
import VideoChatApp from "../../connection/videochat";
import { useSmartContract } from "hooks/useSmartContract";
import { Alert, Button } from "react-bootstrap";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import LockScreen from "react-lock-screen";
import { useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import Typical from "react-typical";
import ToggleDisplay from "react-toggle-display";
import { useScreenshot } from "use-react-screenshot";

const socket = require("../../connection/socket").socket;
class CryptoChessGame extends React.Component {
  state = {
    gameState: new Game(this.props.color),
    draggedPieceTargetId: "", // empty string means no piece is being dragged
    playerTurnToMoveIsWhite: true,
    whiteKingInCheck: false,
    blackKingInCheck: false,
  };

  componentDidMount() {
    console.log(this.props.myUserName);
    console.log(this.props.opponentUserName);
    // register event listeners
    socket.on("opponent move", (move) => {
      // move == [pieceId, finalPosition]
      // console.log("opponenet's move: " + move.selectedId + ", " + move.finalPosition)
      if (move.playerColorThatJustMovedIsWhite !== this.props.color) {
        this.movePiece(
          move.selectedId,
          move.finalPosition,
          this.state.gameState,
          false
        );
        this.setState({
          playerTurnToMoveIsWhite: !move.playerColorThatJustMovedIsWhite,
        });
      }
    });
  }

  startDragging = (e) => {
    this.setState({
      draggedPieceTargetId: e.target.attrs.id,
    });
  };

  movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {
    /**
     * "update" is the connection between the model and the UI.
     * This could also be an HTTP request and the "update" could be the server response.
     * (model is hosted on the server instead of the browser)
     */
    var whiteKingInCheck = false;
    var blackKingInCheck = false;
    var blackCheckmated = false;
    var whiteCheckmated = false;
    const update = currentGame.movePiece(selectedId, finalPosition, isMyMove);

    if (update === "moved in the same position.") {
      this.revertToPreviousState(selectedId); // pass in selected ID to identify the piece that messed up
      return;
    } else if (update === "user tried to capture their own piece") {
      this.revertToPreviousState(selectedId);
      return;
    } else if (update === "b is in check" || update === "w is in check") {
      // change the fill of the enemy king or your king based on which side is in check.
      // play a sound or something
      if (update[0] === "b") {
        blackKingInCheck = true;
      } else {
        whiteKingInCheck = true;
      }
    } else if (
      update === "b has been checkmated" ||
      update === "w has been checkmated"
    ) {
      if (update[0] === "b") {
        blackCheckmated = true;
      } else {
        whiteCheckmated = true;
      }
    } else if (update === "invalid move") {
      this.revertToPreviousState(selectedId);
      return;
    }

    // let the server and the other client know your move
    if (isMyMove) {
      socket.emit("new move", {
        nextPlayerColorToMove: !this.state.gameState.thisPlayersColorIsWhite,
        playerColorThatJustMovedIsWhite:
          this.state.gameState.thisPlayersColorIsWhite,
        selectedId: selectedId,
        finalPosition: finalPosition,
        gameId: this.props.gameId,
      });
    }

    this.props.playAudio();

    // sets the new game state.
    this.setState({
      draggedPieceTargetId: "",
      gameState: currentGame,
      playerTurnToMoveIsWhite: !this.props.color,
      whiteKingInCheck: whiteKingInCheck,
      blackKingInCheck: blackKingInCheck,
    });

    if (blackCheckmated) {
      document.cookie = "winner=white";
      alert(
        "WHITE WON BY CHECKMATE! Accept the transaction to claim rewards!!"
      );
      // Call the function to claim the reward
    } else if (whiteCheckmated) {
      document.cookie = "winner=black";
      alert(
        "BLACK WON BY CHECKMATE! Accept the transaction to claim rewards!!"
      );
    }
  };

  endDragging = (e) => {
    const currentGame = this.state.gameState;
    const currentBoard = currentGame.getBoard();
    const finalPosition = this.inferCoord(
      e.target.x() + 90,
      e.target.y() + 90,
      currentBoard
    );
    const selectedId = this.state.draggedPieceTargetId;
    this.movePiece(selectedId, finalPosition, currentGame, true);
  };

  revertToPreviousState = (selectedId) => {
    /**
     * Should update the UI to what the board looked like before.
     */
    const oldGS = this.state.gameState;
    const oldBoard = oldGS.getBoard();
    const tmpGS = new Game(true);
    const tmpBoard = [];

    for (var i = 0; i < 8; i++) {
      tmpBoard.push([]);
      for (var j = 0; j < 8; j++) {
        if (oldBoard[i][j].getPieceIdOnThisSquare() === selectedId) {
          tmpBoard[i].push(new Square(j, i, null, oldBoard[i][j].canvasCoord));
        } else {
          tmpBoard[i].push(oldBoard[i][j]);
        }
      }
    }

    // temporarily remove the piece that was just moved
    tmpGS.setBoard(tmpBoard);

    this.setState({
      gameState: tmpGS,
      draggedPieceTargetId: "",
    });

    this.setState({
      gameState: oldGS,
    });
  };

  inferCoord = (x, y, chessBoard) => {
    // console.log("actual mouse coordinates: " + x + ", " + y)
    /*
            Should give the closest estimate for new position. 
        */
    var hashmap = {};
    var shortestDistance = Infinity;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        const canvasCoord = chessBoard[i][j].getCanvasCoord();
        // calculate distance
        const delta_x = canvasCoord[0] - x;
        const delta_y = canvasCoord[1] - y;
        const newDistance = Math.sqrt(delta_x ** 2 + delta_y ** 2);
        hashmap[newDistance] = canvasCoord;
        if (newDistance < shortestDistance) {
          shortestDistance = newDistance;
        }
      }
    }

    return hashmap[shortestDistance];
  };

  render() {
    // console.log(this.state.gameState.getBoard())
    //  console.log("it's white's move this time: " + this.state.playerTurnToMoveIsWhite)
    /*
            Look at the current game state in the model and populate the UI accordingly
        */
    // console.log(this.state.gameState.getBoard())

    return (
      <React.Fragment>
        <div
          style={{
            backgroundImage: `url(${Board})`,
            width: "720px",
            height: "720px",
          }}
        >
          <Stage width={720} height={720}>
            <Layer>
              {this.state.gameState.getBoard().map((row) => {
                return (
                  <React.Fragment>
                    {row.map((square) => {
                      if (square.isOccupied()) {
                        return (
                          <Piece
                            x={square.getCanvasCoord()[0]}
                            y={square.getCanvasCoord()[1]}
                            imgurls={piecemap[square.getPiece().name]}
                            isWhite={square.getPiece().color === "white"}
                            draggedPieceTargetId={
                              this.state.draggedPieceTargetId
                            }
                            onDragStart={this.startDragging}
                            onDragEnd={this.endDragging}
                            id={square.getPieceIdOnThisSquare()}
                            thisPlayersColorIsWhite={this.props.color}
                            playerTurnToMoveIsWhite={
                              this.state.playerTurnToMoveIsWhite
                            }
                            whiteKingInCheck={this.state.whiteKingInCheck}
                            blackKingInCheck={this.state.blackKingInCheck}
                          />
                        );
                      }
                      return;
                    })}
                  </React.Fragment>
                );
              })}
            </Layer>
          </Stage>
        </div>
      </React.Fragment>
    );
  }
}

const CryptoChessGameWrapper = (props) => {
  /**
   * player 1
   *      - socketId 1
   *      - socketId 2 ???
   * player 2
   *      - socketId 2
   *      - socketId 1
   */

  // get the gameId from the URL here and pass it to the chessGame component as a prop.
  var t;
  var timer_is_on = 0;
  const domainName = "https://checkmatic.github.io/draft-deploy";
  const color = React.useContext(ColorContext);
  const { gameid } = useParams();
  const [play] = useSound(chessMove);
  const [opponentSocketId, setOpponentSocketId] = React.useState("");
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
  const [opponentUserName, setUserName] = React.useState("");
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const {
    getGameState,
    initGameBlack,
    whiteDeposit,
    whiteWithdraw,
    blackDeposit,
    whiteWon,
    blackWon,
  } = useSmartContract();
  const [boardNumber, setBoardNumber] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [bet, setBet] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getBoardNumber = () => {
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

    socket.emit("boardNumber", boardNumber);

    return boardNumber;
  };

  const getBoardNumberForBlack = () => {
    var decoded_cookie = decodeURIComponent(document.cookie);
    var ca = decoded_cookie.split(";");

    var boardNumber = "";
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf("black") == 0) {
        boardNumber = c.substring(6, c.length);
      }
    }

    console.log("boardNumber: " + boardNumber);

    setBoardNumber(boardNumber);
    return Number(boardNumber);
  };

  const getBet = () => {
    var decoded_cookie = decodeURIComponent(document.cookie);
    var ca = decoded_cookie.split(";");

    var bet = "";
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf("bet") == 0) {
        bet = c.substring(4, c.length);
      }

      console.log("bet: " + bet);
    }

    setBet(Number(bet));

    return Number(bet);
  };

  React.useEffect(() => {
    socket.on("playerJoinedRoom", (statusUpdate) => {
      console.log(
        "A new player has joined the room! Username: " +
          statusUpdate.userName +
          ", Game id: " +
          statusUpdate.gameId +
          " Socket id: " +
          statusUpdate.mySocketId
      );
      if (socket.id !== statusUpdate.mySocketId) {
        setOpponentSocketId(statusUpdate.mySocketId);
      }
    });

    socket.on("status", (statusUpdate) => {
      console.log(statusUpdate);
      alert(statusUpdate);
      if (
        statusUpdate === "This game session does not exist." ||
        statusUpdate === "There are already 2 people playing in this room."
      ) {
        doesntExist(true);
      }
    });

    socket.on("start game", (opponentUserName) => {
      console.log("START!");
      socket.on("boardNumber", (data) => {
        // alert(data);
        // console.log(data);
        document.cookie = "black=" + data;
      });
      if (opponentUserName !== props.myUserName) {
        setUserName(opponentUserName);
        didJoinGame(true);
      } else {
        // in chessGame, pass opponentUserName as a prop and label it as the enemy.
        // in chessGame, use reactContext to get your own userName
        // socket.emit('myUserName')
        socket.emit("request username", gameid);
      }
    });

    socket.on("give userName", (socketId) => {
      if (socket.id !== socketId) {
        console.log("give userName stage: " + props.myUserName);
        socket.emit("recieved userName", {
          userName: props.myUserName,
          gameId: gameid,
        });
        socket.emit("boardNumber", getBoardNumber());
      }
    });

    socket.on("get Opponent UserName", (data) => {
      if (socket.id !== data.socketId) {
        setUserName(data.userName);
        console.log("data.socketId: data.socketId");
        setOpponentSocketId(data.socketId);
        socket.on("boardNumber", (data) => {
          // alert(data);
          console.log("boardNumber: " + data);
        });
        didJoinGame(true);
      }
    });
  }, []);

  function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  async function checkFunction(boardNumber) {
    await getGameState(Number(boardNumber));
    let state = getCookie("checkState");
    let winner = getCookie("winner");
    console.log("checkState: " + state);
    if (state === "2") {
      setShowGameState(true);
      setShowWhiteDeposit(false);
      setshowWhiteWithdraw(true);
      setShowBlackDeposit(true);
      setShowClaimButtonForWhite(true);
      setShowClaimButtonForBlack(true);
      notify(state);
    } else if (state === "3") {
      setShowGameState(true);
      setShowWhiteDeposit(true);
      setshowWhiteWithdraw(true);
      setShowBlackDeposit(false);
      setShowClaimButtonForWhite(true);
      setShowClaimButtonForBlack(true);
      notify(state);
    } else if (state === "4") {
      setShowGameState(true);
      setShowWhiteDeposit(true);
      setshowWhiteWithdraw(true);
      setShowBlackDeposit(true);
      setShowClaimButtonForWhite(true);
      notify(state);
      clearInterval(intervalDuration);
      alert(
        "The game is  now ready to play!"
      )

    if (winner === "black") {
      setShowClaimButtonForBlack(false);
    } else if (winner === "white") {
      setShowClaimButtonForWhite(false);
    }
  }

  async function notify(state) {
    if (state === "2") {
      return (
        <div>
          <Typical
            steps={["Game", 1000, "In Progress", 1000]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      );
    } else if (state === "3") {
      return (
        <div>
          <Typical
            steps={["White Player", 1000, `paid ${bet}`, 1000]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      );
    } else if (state === "4") {
      return (
        <div>
          <Typical
            steps={["Black Player", 1000, `paid ${bet}`, 1000]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      );
    } else if (state === "black") {
      return (
        <div>
          <Typical
            steps={["Black Player", 1000, "Won", 1000]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      );
    } else if (state === "white") {
      return (
        <div>
          <Typical
            steps={["White Player", 1000, "Won", 1000]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      );
    }
  }

  useEffect(() => {
    console.log("board number ---------------", boardNumber);
    checkFunction(boardNumber);
  }, [boardNumber]);

  const getLockScreenUi = (setLock) => {
    return (
      <div className="react-lock-screen__ui">
        <img
          width="32"
          src="https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/102-256.png"
          alt="lock"
        />
        <p>Just to be safe, we locked the screen</p>
        <button
          onClick={async () => {
            if (checkFunction(boardNumber) == true) {
              setLock(false);
            } else {
              setInterval(checkFunction(boardNumber), 10000);
            }
          }}
        >
          unlock
        </button>
      </div>
    );
  };
  var intervalDuration = setInterval(checkFunction, 10000, boardNumber);
  const toast = useToast();

  // sleep function
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const [showGameState, setShowGameState] = React.useState(false);
  const [showWhiteDeposit, setShowWhiteDeposit] = React.useState(true);
  const [showBlackDeposit, setShowBlackDeposit] = React.useState(true);
  const [showWhiteWithdraw, setshowWhiteWithdraw] = React.useState(true);
  const [showClaimButtonForWhite, setShowClaimButtonForWhite] =
    React.useState(true);
  const [showClaimButtonForBlack, setShowClaimButtonForBlack] =
    React.useState(true);

  return (
    <React.Fragment>
      {opponentDidJoinTheGame ? (
        <div>
          <Typical
            steps={[
              "Welcome to the game!",
              1000,
              "You are playing against '" + opponentUserName + "' !",
              1000,
            ]}
            loop={1}
            wrapper="h2"
          />
          {!showGameState && (
            <Button
              onClick={async () => {
                await getBoardNumberForBlack();
                await getGameState(Number(boardNumber));
                await getBet();
                // sleep for a second
                await sleep(1000);
                toast({
                  position: "bottom-left",
                  render: () => (
                    <div>
                      {/* <Box
                      color="red"
                      p={3}
                      bg="blue.500"
                      style={{ font: "caption" }}
                    >
                      Game Initiated!
                    </Box> */}
                      <Typical
                        steps={["Game", 1000, "Initiated", 1000]}
                        loop={Infinity}
                        wrapper="p"
                      />
                    </div>
                  ),
                  // 	position: 'bottom-left',
                  // 	title: "You're in the game!",
                  // 	description: "We've created successfully initialized the game for you.",
                  // 	status: 'success',
                  // 	duration: 9000,
                  // 	isClosable: true,
                  // 	size: 'xs',
                });
                await getBoardNumberForBlack();
                await getGameState(Number(boardNumber));
                await getBet();
                await getBoardNumberForBlack();
                await getGameState(Number(boardNumber));
                await getBet();
                await getBoardNumberForBlack();
                await getGameState(Number(boardNumber));
                await getBet();
                handleClickOpen();
              }}
            >
              The Challenge
            </Button>
          )}
          <div>
            {/* <Button onClick={handleClickOpen}>Open My Custom Dialog</Button> */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Greetings from CheckMatic</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Do you accept the challenge of playing against{" "}
                  {opponentUserName}?
                  <br />
                  <Typical
                    steps={["Matic on Stake: " + bet, 1000]}
                    loop={Infinity}
                    wrapper="p"
                  />
                  <br />
                  (If the matic on stake is 0, close this box and click "The
                  Challenge" again)
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button
                  onClick={async () => {
                    handleClose();
                    initGameBlack(Number(boardNumber));
                    if (!hidden) {
                      setHidden(true);
                    }
                    setShowGameState(false);
                  }}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <br />
          {!showWhiteDeposit && (
            <Button
              onClick={async () => {
                try {
                  whiteDeposit(Number(boardNumber), Number(bet));
                  <Typical
                    steps={["Deposited", 1000, "Matic on Stake: " + bet, 1000]}
                    loop={Infinity}
                    wrapper="p"
                  />;
                } catch (e) {
                  <Typical
                    steps={["You have already deposited", 1000]}
                    loop={Infinity}
                    wrapper="p"
                  />;
                }
              }}
            >
              White Deposit
            </Button>
          )}
          <br />
          {!showBlackDeposit && (
            <Button
              onClick={async () => {
                blackDeposit(Number(boardNumber), Number(bet));
                // setShowBlackDeposit(true);
              }}
            >
              Black Deposit
            </Button>
          )}
          <br />
          {!showWhiteWithdraw && (
            <Button
              onClick={async () => {
                whiteWithdraw(Number(boardNumber));
                // setShowWhiteWithdraw(true);
              }}
            >
              White Withdraw
            </Button>
          )}
          <br />
          {!showClaimButtonForWhite && (
            <Button
              onClick={async () => {
                whiteWon(Number(boardNumber));
                // setShowClaimButtonForWhite(true);
              }}
            >
              Claim Button for white
            </Button>
          )}
          <br />
          {!showClaimButtonForBlack && (
            <Button
              onClick={async () => {
                blackWon(Number(boardNumber));
                // if (showClaimButtonForWhite === true) {
                //   setShowClaimButtonForBlack(true);
                // } else {
                //   setShowClaimButtonForBlack(false);
                // }
              }}
            >
              Claim Button for black
            </Button>
          )}

          <h4> Opponent: {opponentUserName} </h4>
          <div style={{ display: "flex" }}>
            {/* <LockScreen  ui={getLockScreenUi}> */}
            <CryptoChessGame
              playAudio={play}
              gameId={gameid}
              color={color.didRedirect}
            />
            <VideoChatApp
              mySocketId={socket.id}
              opponentSocketId={opponentSocketId}
              myUserName={props.myUserName}
              opponentUserName={opponentUserName}
            />
            {/* </LockScreen> */}
          </div>
          <h4> You: {props.myUserName} </h4>
        </div>
      ) : gameSessionDoesNotExist ? (
        <div>
          <h1 style={{ textAlign: "center", marginTop: "200px" }}> :( </h1>
        </div>
      ) : (
        <div>
          <h1
            style={{
              textAlign: "center",
              marginTop: String(window.innerHeight / 8) + "px",
            }}
          >
            Hey <strong>{props.myUserName}</strong>, copy and paste the URL of
            this page and send it to your friend:
          </h1>
          {/* <textarea
            style={{
              marginLeft: String(window.innerWidth / 2 - 290) + "px",
              marginTop: "30" + "px",
              width: "580px",
              height: "30px",
            }}
            onFocus={(event) => {
              console.log("sd");
              event.target.select();
            }}
            value={domainName + "/game/" + gameid}
            type="text"
          ></textarea> */}
          <br></br>

          <h1 style={{ textAlign: "center", marginTop: "100px" }}>
            {" "}
            Waiting for other opponent to join the game...{" "}
          </h1>
        </div>
      )}
    </React.Fragment>
  );
};

export default CryptoChessGameWrapper;
