import React from 'react'
import { Redirect } from 'react-router-dom'
import uuid from 'uuid/v4'
import { ColorContext } from '../context/colorcontext' 
import background from 'img/varying-stripes.svg'
const socket  = require('../connection/socket').socket

/**
 * Onboard is where we create the game room.
 */

class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }
    
    send = () => {
        /**
         * This method should create a new room in the '/' namespace
         * with a unique identifier. 
         */
        const newGameRoomId = uuid()

        // set the state of this component with the gameId so that we can
        // redirect the user to that URL later. 
        this.setState({
            gameId: newGameRoomId
        })

        // emit an event to the server to create a new room 
        socket.emit('createNewGame', newGameRoomId)
    }

    typingUserName = () => {
        // grab the input text from the field from the DOM 
        const typedText = this.textArea.current.value
        
        // set the state with that text
        this.setState({
            inputText: typedText
        })
    }

    render() {
        // !!! TODO: edit this later once you have bought your own domain. 

        return (<React.Fragment>
            {
                this.state.didGetUserName ? 

                <Redirect to = {"/game/" + this.state.gameId}><button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Start Game</button></Redirect>

            :
               <div style={{backgroundImage: `url(${background})`}}>
                   
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Enter Your Coolest Name!</h1>

                    <input style={{border:"0",borderBottom:"2px solid lightgrey",padding:"10px",background:"#f7f7f7",marginLeft: String((window.innerWidth / 2) - 120) + "px", width: "240px", marginTop: "62px", borderColor:"#a7a7a7"}} 
                           ref = {this.textArea}
                           onInput = {this.typingUserName}></input>
                           
                    <button className="btn btn-primary" 
                        style = {{"border":"1px solid #e8e8e8","color":"black","padding":"0.7em 1.7em","fontSize":"18px","borderRadius":"0.2em","background":"#e8e8e8","transition":"all .3s","boxShadow":"6px 6px 12px #c5c5c5,\n             -6px -6px 12px #ffffff",marginBottom:"100px",marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px", 
                        "button_active":{"boxShadow":"4px 4px 12px #c5c5c5,\n -4px -4px 12px #ffffff"}, }} 
                        disabled = {!(this.state.inputText.length > 0)} 
                        onClick = {() => {
                            // When the 'Submit' button gets pressed from the username screen,
                            // We should send a request to the server to create a new room with
                            // the uuid we generate here.
                            this.props.didRedirect() 
                            this.props.setUserName(this.state.inputText) 
                            this.setState({
                                didGetUserName: true
                            })
                            this.send()
                        }}>Play Now</button>
                </div>
            }
            </React.Fragment>)
    }
}

const Onboard = (props) => {
    const color = React.useContext(ColorContext)

    return <CreateNewGame didRedirect = {color.playerDidRedirect} setUserName = {props.setUserName}/>
}


export default Onboard
