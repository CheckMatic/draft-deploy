import io from "socket.io-client";

const URL = "https://backendchess.herokuapp.com";

const socket = io(URL);

var mySocketId;
// register preliminary event listeners here:

socket.on("createNewGame", async (statusUpdate) => {
  console.log(
    "A new game has been created! Username: " +
      statusUpdate.userName +
      ", Game id: " +
      statusUpdate.gameId +
      " Socket id: " +
      statusUpdate.mySocketId
  );
  console.log(statusUpdate);
  mySocketId = await statusUpdate.mySocketId;
});

export { socket, mySocketId };
