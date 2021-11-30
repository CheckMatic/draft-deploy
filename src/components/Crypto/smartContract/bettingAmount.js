// take input from user
import { useState } from "react";
import { useMoralis, useNativeBalance } from "react-moralis";
import { useSmartContract } from "hooks/useSmartContract";

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
      <h1>Betting Amount</h1>
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
      />
      <button
        onClick={() => {
          if (bet > 0 && bet < balance.formatted) {
            initGameWhite(bet);
          } else {
            alert("Please enter a valid amount");
          }
        }}
      >
        Bet
      </button>
    </div>
  );
}

export default BettingAmount;
