import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import logo from "img/logo.png";
import Account from "components/Account";
import Chains from "components/Chains";
import TokenPrice from "components/TokenPrice";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import InchDex from "components/InchDex";
import NFTBalance from "components/NFTBalance";
import Wallet from "components/Wallet";
import { Layout, Tabs } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import QuickStart from "components/QuickStart";
import Contract from "components/Contract/Contract";
import Text from "antd/lib/typography/Text";
import Ramper from "components/Ramper";
import MenuItems from "./components/MenuItems";

// Chess Game
import React from "react";
import JoinRoom from "./components/onboard/joinroom";
import { ColorContext } from "./components/context/colorcontext";
import Onboard from "./components/onboard/onboard";
import JoinGame from "./components/onboard/joingame";
import ChessGame from "./components/chess/ui/chessgame";

// Crypto Chess Game
import CryptoJoinRoom from "components/Crypto/onboard/joinroom";
import { CryptoColorContext } from "components/Crypto/context/colorcontext";
import CryptoOnboard from "components/Crypto/onboard/onboard";
import CryptoJoinGame from "components/Crypto/onboard/joingame";
import CryptoChessGame from "components/Crypto/chess/ui/chessgame";
import BettingAmount from "components/Crypto/smartContract/bettingAmount";

// Minting NFTs
import CreateNFT from "components/CreateNFT/CreateNFT";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const [didRedirect, setDidRedirect] = React.useState(false);

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true);
  }, []);

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false);
  }, []);

  const [userName, setUserName] = React.useState("");

  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <TokenPrice
              address="0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
              chain="polygon"
              image="https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"
              size="40px"
            />
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          {!isAuthenticated ? (
            <>Please login using the "Authenticate" button</>
          ) : (
            <Switch>
              <Route path="/quickstart">
                <QuickStart isServerInfo={isServerInfo} />
              </Route>
              <Route path="/wallet">
                <Wallet />
              </Route>
              <Route path="/1inch">
                <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                  <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                    <InchDex chain="eth" />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                    <InchDex chain="bsc" />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                    <InchDex chain="polygon" />
                  </Tabs.TabPane>
                </Tabs>
              </Route>
              <Route path="/erc20balance">
                <ERC20Balance />
              </Route>
              <Route path="/onramp">
                <Ramper />
              </Route>
              <Route path="/erc20transfers">
                <ERC20Transfers />
              </Route>
              <Route path="/nftBalance">
                <NFTBalance />
              </Route>
              <Route path="/contract">
                <Contract />
              </Route>
              <Route exact path="/">
                <Redirect to="/quickstart" />
              </Route>
              <Route exact path="/nft">
                <CreateNFT />
              </Route>
              <Route path="/nonauthenticated">
                <>Please login using the "Authenticate" button</>
              </Route>
              <ColorContext.Provider
                value={{
                  didRedirect: didRedirect,
                  playerDidRedirect: playerDidRedirect,
                  playerDidNotRedirect: playerDidNotRedirect,
                }}
              >
                <Route exact path="/setbet">
                  <BettingAmount />
                </Route>
                <Route exact path="/chess">
                  <Onboard setUserName={setUserName} />
                </Route>
                <Route exact path="/game/:gameid">
                  {didRedirect ? (
                    <React.Fragment>
                      <JoinGame userName={userName} isCreator={true} />
                      <ChessGame myUserName={userName} />
                    </React.Fragment>
                  ) : (
                    <JoinRoom />
                  )}
                </Route>
                <Route exact path="/cryptochess">
                  <CryptoOnboard setUserName={setUserName} />
                </Route>
                <Route exact path="/crypto/:gameid">
                  {didRedirect ? (
                    <React.Fragment>
                      <CryptoJoinGame userName={userName} isCreator={true} />
                      <CryptoChessGame myUserName={userName} />
                    </React.Fragment>
                  ) : (
                    <CryptoJoinRoom />
                  )}
                </Route>
              </ColorContext.Provider>
            </Switch>
          )}
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}></Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <img src={logo} style={{ width: "60px" }} />
  </div>
);

export default App;
