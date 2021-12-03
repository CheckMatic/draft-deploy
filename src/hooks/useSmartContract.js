import ABI from "../ABI.json";
import { useMoralis } from "react-moralis";

const contractAddress = "0x08c4d172937054a861388be461d482bd4915dcda";

export const useSmartContract = () => {
  const { web3, Moralis, user } = useMoralis();

  // Initialize the game as White (0)
  const initGameWhite = async (_bettingAmount) => {
    await window.ethereum.enable();
    var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
    const currentUser = user.attributes.ethAddress;
    const bettingAmount = Moralis.Units.ETH(_bettingAmount);
    const id = await CheckMatic.methods
      .initGameWhite(bettingAmount)
      .send({
        from: currentUser,
      })
      .then((res) => {
        console.log(res);
        var boardNumber = res.events.GameID.returnValues._boardNumber;
        document.cookie = `boardNumber=${boardNumber}`;
      });
  };

  // get game state of the current board number
  const getGameState = async (boardNumber) => {
    await window.ethereum.enable();
    var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
    const currentUser = user.attributes.ethAddress;
    const id = await CheckMatic.methods
      .Games(boardNumber)
      .call({
        from: currentUser,
      })
      .then(async (res) => {
        console.log(res);
        const json = JSON.stringify(res);
        const parsed = JSON.parse(json);
        console.log("Parsed: ", parsed.bet);
        document.cookie = `bet=${Moralis.Units.FromWei(parsed.bet)}`;
        return await parsed.bet;
      });
  };

  return {
    initGameWhite,
    getGameState,
  };
};
