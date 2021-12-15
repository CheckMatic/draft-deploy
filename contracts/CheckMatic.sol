// Deployed at Polygon Mumbai Testnet: 0x08c4d172937054a861388be461d482bd4915dcda

pragma solidity >=0.7.0 <0.9.0;

contract CheckMatic{
    
    // Game states which can happen over the board 
    
    enum GameState { NOT_INITIATED, WHITE_INITIATED, BLACK_INITITATED , WHITE_PAID , BLACK_PAID, COMPLETED }
    
    event GameID(address indexed _from,uint _boardNumber);
    event GameStarted(uint _boardNumber,address indexed _whitePlayer,address indexed _blackPlayer);
    event GameWinner(uint _boardNumber,address indexed _winnerAddress);
    
    
    struct ChessBoard{
        // Checking the state of one game 
        GameState currState;
        
        // Checking if both players have joined 
        bool isWhiteIn;
        bool isBlackIn;
        
        // Crypto on the line 
        uint bet;
        
        // Managing Times  
        uint whitePaidTime;
        uint gameStartedTime;
        
        // Addresses of both players 
        address payable white_address;
        address payable black_address;
    }
    
    uint256 public curr_id = 0;
    
    mapping (uint256 => ChessBoard) public Games;
    
    function initGameWhite(uint256 _bettingAmount) public returns (uint)
    {
        curr_id+=1;
        require(Games[curr_id].currState == GameState.NOT_INITIATED);
        Games[curr_id].isWhiteIn = true;
        Games[curr_id].white_address = payable(msg.sender);
        Games[curr_id].currState = GameState.WHITE_INITIATED;
        Games[curr_id].bet = _bettingAmount * (1 wei);
        
        emit GameID(msg.sender,curr_id);
        return curr_id;
    }
    
    function initGameBlack(uint256 game_id) public
    {
        require(Games[game_id].currState == GameState.WHITE_INITIATED,"White hasn't initiated yet");
        Games[game_id].isBlackIn = true;
        Games[game_id].black_address = payable(msg.sender);
        Games[game_id].currState = GameState.BLACK_INITITATED;
    }
    
    function whiteDeposit(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.BLACK_INITITATED,"Black hasn't initiate yet");
        require(msg.sender == Games[game_id].white_address,"White Address Doesn't Match");
        require(msg.value == Games[game_id].bet,"Wrong Deposit Amount");
        Games[game_id].currState = GameState.WHITE_PAID;
        Games[game_id].whitePaidTime = block.timestamp;
    }
    
    function whiteWithdraw(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.WHITE_PAID,"Can't withdraw now, game has begun");
        require(msg.sender == Games[game_id].white_address,"This address can't withdraw");
        require(block.timestamp >= Games[game_id].whitePaidTime + 5 minutes,"Wait for 5 mins");
        Games[game_id].white_address.transfer(Games[game_id].bet);
        Games[game_id].currState = GameState.COMPLETED;
    }
    
    function blackDeposit(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.WHITE_PAID,"White Player hasn't paid yet");
        require(msg.sender == Games[game_id].black_address,"Black player address doesn't match");
        require(msg.value == Games[game_id].bet,"Wrong Deposit Amount");
        Games[game_id].currState = GameState.BLACK_PAID;
        Games[game_id].gameStartedTime = block.timestamp;
        emit GameStarted(game_id, Games[game_id].white_address,Games[game_id].black_address);
    }
    
    function whiteWon(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.BLACK_PAID,"Can't claim now");
        require(msg.sender == Games[game_id].white_address,"You can't claim this award");
        Games[game_id].white_address.transfer( Games[game_id].bet * 2);
        Games[game_id].currState = GameState.COMPLETED;
        emit GameWinner(game_id,Games[game_id].white_address);
    }
    
    function blackWon(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.BLACK_PAID,"Can't claim now");
        require(msg.sender == Games[game_id].black_address,"You can't claim this award");
        Games[game_id].black_address.transfer( Games[game_id].bet * 2 );
        Games[game_id].currState = GameState.COMPLETED;
        emit GameWinner(game_id,Games[game_id].black_address);
    }
    
    function releaseAllFunds(uint256 game_id) public payable
    {
        require(Games[game_id].currState == GameState.BLACK_PAID,"Can't use this button now");
        require(msg.sender == Games[game_id].black_address || msg.sender == Games[game_id].white_address  ,"You are not authorized");
        require(block.timestamp >= Games[game_id].gameStartedTime + 10 minutes,"Wait for 10 mins ");
        Games[game_id].black_address.transfer(Games[game_id].bet);
        Games[game_id].white_address.transfer(Games[game_id].bet);
    }
    
}