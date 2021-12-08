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
import chessgif from "img/chesspawn.gif";
import chessboard1 from "img/1.gif";
import chessboard2 from "img/2.gif";
import chessboard3 from "img/3.gif";
import chessboard4 from "img/4.gif";
import dboard from "img/3dboard.gif";

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
    
    <div style={{fontFamily: "'Montserrat', sans-serif;" }}>
      
      <div style={{marginBottom:"50px",backgroundColor:"#22292f","display":"grid","gridTemplateColumns":"repeat(2, 1fr)","gridTemplateRows":"1fr","gridColumnGap":"10px","gridRowGap":"10px"}}>
        <h1 style={{paddingTop: "25%", color:"white", paddingLeft:"100px", paddingRight:"50px", lineHeight:"1.6"}}>CheckMatic Adds Fun & Thrill to the Game of Chess using Crypto! <u>Stake, Play & Earn</u></h1>
        <img src={chessgif} style={{marginTop: "10px", marginBottom:"10px"}} />
      </div>
       <h1 style={{ fontSize: "50px", textAlign: "center", paddingBottom: "20px" }}>
        Play Chess like Never Before!
      </h1>

      <span
        style={{
          display: "table-cell",
          fontSize: "20px",
          textAlign: "center",
          width: "50%",
          paddingBottom: "20px"
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
        <NavLink to="/setbet">
          <Button variant="warning" style={{ margin: "10px" }}>
            Play with Crypto
          </Button>{" "}
        </NavLink>
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
      <div style={{"display":"grid","gridTemplateColumns":"repeat(4, 1fr)","gridTemplateRows":"1fr","gridColumnGap":"10px","gridRowGap":"10px"}}>

<img src={chessboard1}  />
<img src={chessboard3} />
<img src={chessboard2}/>
<img src={chessboard4} />


</div>
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
      <div style={{backgroundColor:"white", margin:"10px", padding: "10px"}}>
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
      <div style={{"display":"grid","gridTemplateColumns":"1fr 1.5fr","gridTemplateRows":"1fr","gridColumnGap":"10px","gridRowGap":"10px"}}>
      
      <img src={dboard} style={{paddingLeft: "30%", paddingTop:"10px"}}/>

      <p
        style={{
          paddingLeft: "",
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

      </div>
      </div>
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
                <h1 style={{ color: "black" }}>Built on Polygon & Moralis</h1>
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
        <NavLink to="/setbet">
          <Button
            variant="warning"
            style={{ margin: "10px", fontWeight: "600" }}
          >
            Stake Your Crypto & Play Now!
          </Button>{" "}
        </NavLink>
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
            <NavLink to="/1inch">
              <Button variant="primary">Swap Now</Button>
            </NavLink>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>Balances</Card.Title>
            <Card.Text>
              Get to know the number of tokens in your Connected Web3 Wallet
            </Card.Text>
            <NavLink to="/erc20balance">
              <Button variant="primary">Check Now</Button>
            </NavLink>
          </Card.Body>
        </Card>
      </div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#273036" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    </div>
  );
}
