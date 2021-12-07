import React from 'react';
import Game from '../model/chess';
import Square from '../model/square';
import { Stage, Layer } from 'react-konva';
import Board from '../assets/chessBoard.png';
import useSound from 'use-sound';
import chessMove from '../assets/moveSoundEffect.mp3';
import Piece from './piece';
import piecemap from './piecemap';
import { useParams } from 'react-router-dom';
import { ColorContext } from 'components/context/colorcontext';
import VideoChatApp from '../../connection/videochat';
import { useSmartContract } from 'hooks/useSmartContract';
import { Button } from 'react-bootstrap';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import LockScreen from 'react-lock-screen';

const socket = require('../../connection/socket').socket;

class CryptoChessGame extends React.Component {
	state = {
		gameState: new Game(this.props.color),
		draggedPieceTargetId: '', // empty string means no piece is being dragged
		playerTurnToMoveIsWhite: true,
		whiteKingInCheck: false,
		blackKingInCheck: false,
	};

	componentDidMount() {
		console.log(this.props.myUserName);
		console.log(this.props.opponentUserName);
		// register event listeners
		socket.on('opponent move', (move) => {
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

		if (update === 'moved in the same position.') {
			this.revertToPreviousState(selectedId); // pass in selected ID to identify the piece that messed up
			return;
		} else if (update === 'user tried to capture their own piece') {
			this.revertToPreviousState(selectedId);
			return;
		} else if (update === 'b is in check' || update === 'w is in check') {
			// change the fill of the enemy king or your king based on which side is in check.
			// play a sound or something
			if (update[0] === 'b') {
				blackKingInCheck = true;
			} else {
				whiteKingInCheck = true;
			}
		} else if (
			update === 'b has been checkmated' ||
			update === 'w has been checkmated'
		) {
			if (update[0] === 'b') {
				blackCheckmated = true;
			} else {
				whiteCheckmated = true;
			}
		} else if (update === 'invalid move') {
			this.revertToPreviousState(selectedId);
			return;
		}

		// let the server and the other client know your move
		if (isMyMove) {
			socket.emit('new move', {
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
			draggedPieceTargetId: '',
			gameState: currentGame,
			playerTurnToMoveIsWhite: !this.props.color,
			whiteKingInCheck: whiteKingInCheck,
			blackKingInCheck: blackKingInCheck,
		});

		if (blackCheckmated) {
			alert('WHITE WON BY CHECKMATE! Accept the transaction to claim rewards!!');
			// Call the function to claim the reward
		} else if (whiteCheckmated) {
			alert('BLACK WON BY CHECKMATE! Accept the transaction to claim rewards!!');
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
			draggedPieceTargetId: '',
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
						width: '720px',
						height: '720px',
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
														isWhite={square.getPiece().color === 'white'}
														draggedPieceTargetId={this.state.draggedPieceTargetId}
														onDragStart={this.startDragging}
														onDragEnd={this.endDragging}
														id={square.getPieceIdOnThisSquare()}
														thisPlayersColorIsWhite={this.props.color}
														playerTurnToMoveIsWhite={this.state.playerTurnToMoveIsWhite}
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
<<<<<<< Updated upstream
  /**
   * player 1
   *      - socketId 1
   *      - socketId 2 ???
   * player 2
   *      - socketId 2
   *      - socketId 1
   */

  // get the gameId from the URL here and pass it to the chessGame component as a prop.
  const domainName = "http://localhost:3000";
  const color = React.useContext(ColorContext);
  const { gameid } = useParams();
  const [play] = useSound(chessMove);
  const [opponentSocketId, setOpponentSocketId] = React.useState("");
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
  const [opponentUserName, setUserName] = React.useState("");
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false);
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

  return (
    <React.Fragment>
      {opponentDidJoinTheGame ? (
        <div>
          Asking Black player to join the game...
          <Button
            onClick={async () => {
              await getBoardNumberForBlack();
              await getGameState(Number(boardNumber));
              await getBet();
            }}
          >
            Get Game States
          </Button>
          <div>
            <Button onClick={handleClickOpen}>Open My Custom Dialog</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Greetings from CheckMatic</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Do you accept the challenge of playing against{" "}
                  {opponentUserName}? Matic on Stake :{bet}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button
                  onClick={async () => {
                    handleClose();
                    initGameBlack(Number(boardNumber));
                  }}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <br />
          <Button
            onClick={async () => {
              whiteDeposit(Number(boardNumber), Number(bet));
            }}
          >
            White Deposit
          </Button>
          <br />
          <Button
            onClick={async () => {
              blackDeposit(Number(boardNumber), Number(bet));
            }}
          >
            Black Deposit
          </Button>
          <br />
          <Button
            onClick={async () => {
              whiteWithdraw(Number(boardNumber));
            }}
          >
            White Withdraw
          </Button>
          <br />
          <Button
            onClick={async () => {
              whiteWon(Number(boardNumber));
            }}
          >
            Claim Button for white
          </Button>
          <br />
          <Button
            onClick={async () => {
              blackWon(Number(boardNumber));
            }}
          >
            Claim Button for black
          </Button>
          <h4> Opponent: {opponentUserName} </h4>
          <div style={{ display: "flex" }}>
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
=======
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
	const domainName = 'http://localhost:3000';
	const color = React.useContext(ColorContext);
	const { gameid } = useParams();
	const [play] = useSound(chessMove);
	const [opponentSocketId, setOpponentSocketId] = React.useState('');
	const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
	const [opponentUserName, setUserName] = React.useState('');
	const [gameSessionDoesNotExist, doesntExist] = React.useState(false);
	const {
		getGameState,
		initGameBlack,
		whiteDeposit,
		whiteWithdraw,
		blackDeposit,
		whiteWon,
		blackWon,
	} = useSmartContract();
	const [boardNumber, setBoardNumber] = React.useState('');
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
		var ca = decoded_cookie.split(';');

		var boardNumber = '';
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf('boardNumber') == 0) {
				boardNumber = c.substring(12, c.length);
			}
		}

		socket.emit('boardNumber', boardNumber);

		return boardNumber;
	};

	const getBoardNumberForBlack = () => {
		var decoded_cookie = decodeURIComponent(document.cookie);
		var ca = decoded_cookie.split(';');

		var boardNumber = '';
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf('black') == 0) {
				boardNumber = c.substring(6, c.length);
			}
		}

		console.log('boardNumber: ' + boardNumber);

		setBoardNumber(boardNumber);
		return Number(boardNumber);
	};

	const getBet = () => {
		var decoded_cookie = decodeURIComponent(document.cookie);
		var ca = decoded_cookie.split(';');

		var bet = '';
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf('bet') == 0) {
				bet = c.substring(4, c.length);
			}

			console.log('bet: ' + bet);
		}

		setBet(Number(bet));

		return Number(bet);
	};

	React.useEffect(() => {
		socket.on('playerJoinedRoom', (statusUpdate) => {
			console.log(
				'A new player has joined the room! Username: ' +
					statusUpdate.userName +
					', Game id: ' +
					statusUpdate.gameId +
					' Socket id: ' +
					statusUpdate.mySocketId
			);
			if (socket.id !== statusUpdate.mySocketId) {
				setOpponentSocketId(statusUpdate.mySocketId);
			}
		});

		socket.on('status', (statusUpdate) => {
			console.log(statusUpdate);
			alert(statusUpdate);
			if (
				statusUpdate === 'This game session does not exist.' ||
				statusUpdate === 'There are already 2 people playing in this room.'
			) {
				doesntExist(true);
			}
		});

		socket.on('start game', (opponentUserName) => {
			console.log('START!');
			socket.on('boardNumber', (data) => {
				// alert(data);
				// console.log(data);
				document.cookie = 'black=' + data;
			});
			if (opponentUserName !== props.myUserName) {
				setUserName(opponentUserName);
				didJoinGame(true);
			} else {
				// in chessGame, pass opponentUserName as a prop and label it as the enemy.
				// in chessGame, use reactContext to get your own userName
				// socket.emit('myUserName')
				socket.emit('request username', gameid);
			}
		});

		socket.on('give userName', (socketId) => {
			if (socket.id !== socketId) {
				console.log('give userName stage: ' + props.myUserName);
				socket.emit('recieved userName', {
					userName: props.myUserName,
					gameId: gameid,
				});
				socket.emit('boardNumber', getBoardNumber());
			}
		});

		socket.on('get Opponent UserName', (data) => {
			if (socket.id !== data.socketId) {
				setUserName(data.userName);
				console.log('data.socketId: data.socketId');
				setOpponentSocketId(data.socketId);
				socket.on('boardNumber', (data) => {
					// alert(data);
					console.log('boardNumber: ' + data);
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
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	async function checkFunction(boardNumber) {
		await getGameState(boardNumber);
		let state = getCookie('checkState' + boardNumber);
		console.log('checkState: ' + state);
		if (state === 4) {
			return true;
		} else {
			return false;
		}
	}

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
					onClick={() => {
						if (checkFunction(boardNumber) == true) {
							setLock(false);
						} else {
							setTimeout(checkFunction(boardNumber), 10);
						}
					}}
				>
					unlock
				</button>
			</div>
		);
	};

	return (
		<React.Fragment>
			{opponentDidJoinTheGame ? (
				<div>
					Asking Black player to join the game...
					<Button
						onClick={async () => {
							await getBoardNumberForBlack();
							await getGameState(Number(boardNumber));
							await getBet();
						}}
					>
						Get Game State
					</Button>
					<div>
						<Button onClick={handleClickOpen}>Open My Custom Dialog</Button>
						<Dialog open={open} onClose={handleClose}>
							<DialogTitle>Greetings from CheckMatic</DialogTitle>
							<DialogContent>
								<DialogContentText>
									Do you accept the challenge of playing against {opponentUserName}?
									Matic on Stake :{bet}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose}>Close</Button>
								<Button
									onClick={async () => {
										handleClose();
										initGameBlack(Number(boardNumber));
									}}
								>
									Yes
								</Button>
							</DialogActions>
						</Dialog>
					</div>
					<br />
					<Button
						onClick={async () => {
							whiteDeposit(Number(boardNumber), Number(bet));
						}}
					>
						White Deposit
					</Button>
					<br />
					<Button
						onClick={async () => {
							blackDeposit(Number(boardNumber), Number(bet));
						}}
					>
						Black Deposit
					</Button>
					<br />
					<Button
						onClick={async () => {
							whiteWithdraw(Number(boardNumber));
						}}
					>
						White Withdraw
					</Button>
					<br />
					<Button
						onClick={async () => {
							whiteWon(Number(boardNumber));
						}}
					>
						Claim Button for white
					</Button>
					<br />
					<Button
						onClick={async () => {
							blackWon(Number(boardNumber));
						}}
					>
						Claim Button for black
					</Button>
					<h4> Opponent: {opponentUserName} </h4>
					<div style={{ display: 'flex' }}>
						<LockScreen timeout={10} ui={getLockScreenUi}>
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
						</LockScreen>
					</div>
					<h4> You: {props.myUserName} </h4>
				</div>
			) : gameSessionDoesNotExist ? (
				<div>
					<h1 style={{ textAlign: 'center', marginTop: '200px' }}> :( </h1>
				</div>
			) : (
				<div>
					<h1
						style={{
							textAlign: 'center',
							marginTop: String(window.innerHeight / 8) + 'px',
						}}
					>
						Hey <strong>{props.myUserName}</strong>, copy and paste the URL of this
						page and send it to your friend:
					</h1>
					{/* <textarea
>>>>>>> Stashed changes
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

					<h1 style={{ textAlign: 'center', marginTop: '100px' }}>
						{' '}
						Waiting for other opponent to join the game...{' '}
					</h1>
				</div>
			)}
		</React.Fragment>
	);
};

export default CryptoChessGameWrapper;
