// take input from user
import { useState } from "react";
import { useMoralis, useNativeBalance } from "react-moralis";
import { useSmartContract } from "hooks/useSmartContract";
import jumpchess from "img/jumpchess.gif";

function BettingAmount() {
  const [bet, setBet] = useState(0);

  const {
    getBalance,
    data: balance,
    nativeToken,
    error,
    isLoading,
  } = useNativeBalance();

  const { initGameWhite } = useSmartContract();

  return (
    <div>
      <h1 style={{paddingBottom:"50px"}}>Enter $MATIC You Want to Stake/Bet</h1>
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
        style={{marginLeft:"33%",marginRight:"10px", backgroundColor: "white", fontSize:"18px", borderRadius:"5px", padding:"10px"}}
      />
      <button style={{borderRadius:"5px", padding:"10px", fontSize:"18px"}}
        onClick={() => {
          if (bet > 0 && bet < balance.formatted) {
            initGameWhite(bet).then((res) => {
              window.location.href = "http://localhost:3000/#/cryptochess";
            });
          } else {
            alert("Please enter a valid amount");
          }
        }}
      >
        Continue
      </button>
      <img src={jumpchess} style={{paddingLeft:"40%", marginTop: "80px", marginBottom:"10px", height:"240px", width:"auto"}} />

    </div>
  );
}

export default BettingAmount;
