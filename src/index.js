import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import QuickStart from "components/QuickStart";
import { BrowserRouter, HashRouter } from "react-router-dom";

/** Get your free Moralis Account https://moralis.io/ */

const APP_ID = "bF1Wa2B59a0vgGAGtxpOE6NzHimrmePa8wPpsyAN";
const SERVER_URL = "https://d1qv5atvepad.usemoralis.com:2053/server";

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  if (isServerInfo)
    return (
      <React.StrictMode>
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
          <App isServerInfo />
        </MoralisProvider>
      </React.StrictMode>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuickStart />
      </div>
    );
  }
};

ReactDOM.render(
  // <React.StrictMode>
  <Application />,
  // </React.StrictMode>,
  document.getElementById("root")
);
