import React from 'react'
import JoinGame from './joingame'
import ChessGame from '../chess/ui/chessgame'
import background from 'img/varying-stripes.svg';


/**
 * Onboard is where we create the game room.
 */

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
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
    
        return (<React.Fragment>
            {
                this.state.didGetUserName ? 
                <React.Fragment>
                    <JoinGame userName = {this.state.inputText} isCreator = {false}/>
                    <ChessGame myUserName = {this.state.inputText}/>
                </React.Fragment>
            :
               <div style={{backgroundImage: `url(${background})`}}>
                    <h1 style={{textAlign: "center", marginTop: String((window.innerHeight / 3)) + "px"}}>Your Username:</h1>

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
                            this.setState({
                                didGetUserName: true
                            })
                        }}>Play</button>
                </div>
            }
            </React.Fragment>)
    }
}

export default JoinRoom
