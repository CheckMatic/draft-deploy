import React from "react";
import { useParams } from "react-router-dom";
const socket = require("../connection/socket").socket;

/**
 * 'Join game' is where we actually join the game room.
 */

const CryptoJoinGameRoom = (gameid, userName, isCreator) => {
  /**
   * For this browser instance, we want
   * to join it to a gameRoom. For now
   * assume that the game room exists
   * on the backend.
   *
   *
   * TODO: handle the case when the game room doesn't exist.
   */
  const idData = {
    gameId: gameid,
    userName: userName,
    isCreator: isCreator,
  };
  socket.emit("playerJoinGame", idData);
  // get the boardNumber from the server
  socket.on("boardNumber", (data) => {
    // alert(data);
    console.log(data);
  });
};

const CryptoJoinGame = (props) => {
  /**
   * Extract the 'gameId' from the URL.
   * the 'gameId' is the gameRoom ID.
   */
  const { gameid } = useParams();
  CryptoJoinGameRoom(gameid, props.userName, props.isCreator);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>CheckMatic</h1>
    </div>
  );
};

export default CryptoJoinGame;
