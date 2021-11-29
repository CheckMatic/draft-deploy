import { Timeline, Typography } from "antd";
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import sliderOne from "img/slider-1.jpg";
import Table from "react-bootstrap/Table";
import thumb from "img/thumb.jpeg";
import chessimg from "img/chess.jpeg";
import { NavLink } from "react-router-dom";
import InchDex from "components/InchDex";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function QuickStart({ isServerInfo }) {
  const { Moralis } = useMoralis();

  const isInchDex = useMemo(
    () => (Moralis.Plugins?.oneInch ? true : false),
    [Moralis.Plugins?.oneInch]
  );

  return (
    <div>
      <h1
        style={{ fontSize: "50px", textAlign: "center", paddingBottom: "20px" }}
      >
        Play Chess like Never Before!
      </h1>

      <span
        style={{
          display: "table-cell",
          fontSize: "20px",
          textAlign: "center",
          width: "50%",
        }}
      >
        are you good enough at chess? showcase your skills with the best players
        out there and earn in crypto if you win!
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      >
        <NavLink to="/chess">
          <Button variant="success" style={{ margin: "10px" }}>
            Play Normal
          </Button>{" "}
        </NavLink>
        <Button variant="warning" style={{ margin: "10px" }}>
          Play with Crypto
        </Button>{" "}
      </div>

      <div style={{ marginTop: "20px" }}>
        <img src={thumb} style={{ width: "100%", paddingTop: "25px" }} />
      </div>

      <h1
        style={{ fontWeight: "800", textAlign: "center", paddingTop: "50px" }}
      >
        Put Your Skills to Test!
      </h1>
      <p
        style={{
          fontWeight: "400",
          paddingTop: "25px",
          paddingBottom: "25px",
          textAlign: "center",
        }}
      >
        stake you crypto with you opponent living on the other side of the world
        and play the beautiful and competitive game of chess on the Ethereum
        Network, bet on your skillset and Earn in Crypto if you win!
      </p>

      <hr></hr>
      <Table style={{ marginTop: "50px", textAlign: "center" }}>
        <tbody>
          <tr style={{ backgroundColor: "white" }}>
            <td>
              <h1
                style={{
                  color: "black",
                  textAlign: "left",
                  paddingBottom: "15px",
                  paddingLeft: "50%",
                  paddingTop: "20px",
                }}
              >
                <Badge pill bg="success">
                  How does it work?
                </Badge>
              </h1>
              <p
                style={{
                  color: "black",
                  fontWeight: "400",
                  textAlign: "left",
                  paddingLeft: "50%",
                }}
              >
                🔗 Connect Your Metamask Wallet<br></br>
                🎮 Click on Play with Crypto<br></br>
                💲 Sign and Stake Your Tokens<br></br>
                👑 Winners Take it All
              </p>
            </td>

            <td>
              <img
                src={chessimg}
                style={{ alignItems: "right" }}
                height="250px"
                width="350px"
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <hr></hr>
      <h1
        style={{
          marginTop: "50px",
          marginLeft: "15%",
          marginRight: "15%",
          color: "black",
          textAlign: "center",
          paddingBottom: "15px",
          backgroundColor: "orange",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
        }}
      >
        Chess + Crypto = Thrill & Competitiveness
      </h1>
      <p
        style={{
          paddingLeft: "25%",
          paddingRight: "25%",
          paddingTop: "50px",
          paddingBottom: "40px",
          textAlign: "center",
        }}
      >
        Compete with Players Globally in an Intellectually Stimulating Game of
        Chess, Stake Your Tokens and experience the thrill and intensity of the
        Game! With our Advance matchmaking algorithm get connected with the
        right opponent and enjoy playing Chess
      </p>
      <Table
        striped
        bordered
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <tbody>
          <tr>
            <td>
              <div
                style={{
                  display: "block",
                  backgroundColor: "black",
                  padding: "20px",
                  color: "white",
                }}
              >
                <h1 style={{ color: "white" }}>Play Online</h1>
                <p></p>
              </div>
            </td>

            <td>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  color: "black",
                }}
              >
                <h1 style={{ color: "black" }}>Find Opponents</h1>
                <p></p>
              </div>
            </td>

            <td>
              <div
                style={{
                  backgroundColor: "black",
                  padding: "20px",
                  color: "white",
                }}
              >
                <h1 style={{ color: "white" }}>Stake Your Crypto</h1>
                <p></p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div
                style={{
                  display: "block",
                  backgroundColor: "white",
                  padding: "20px",
                  color: "black",
                }}
              >
                <h1 style={{ color: "black" }}>Built on Ethereum</h1>
                <p></p>
              </div>
            </td>

            <td>
              <div
                style={{
                  backgroundColor: "black",
                  padding: "20px",
                  color: "white",
                }}
              >
                <h1 style={{ color: "white" }}>Mint NFT's</h1>
                <p></p>
              </div>
            </td>

            <td>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  color: "black",
                }}
              >
                <h1 style={{ color: "black" }}>Play over Video</h1>
                <p></p>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      >
        <Button variant="warning" style={{ margin: "10px", fontWeight: "600" }}>
          Stake Your Crypto & Play Now!
        </Button>{" "}
      </div>

      <hr></hr>

      <div className="d-flex justify-content-around">
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>About Us</Card.Title>
            <Card.Text>
              Learn about our Purpose and Vision behind building CheckMatic
            </Card.Text>
            <Button variant="primary">Learn More</Button>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>DEX</Card.Title>
            <Card.Text>
              We have partnered with 1Inch to provide you access to Swaps
            </Card.Text>
            <Button variant="primary">Swap Now</Button>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>Balances</Card.Title>
            <Card.Text>
              Get to know the number of tokens in your Connected Web3 Wallet
            </Card.Text>
            <Button variant="primary">Check Now</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
