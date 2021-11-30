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
        return res.events.GameID.returnValues._boardNumber;
      });
  };

  return {
    initGameWhite,
  };
};
