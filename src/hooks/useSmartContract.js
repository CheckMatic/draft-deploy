import ABI from '../ABI.json';
import { useMoralis } from 'react-moralis';

const contractAddress = '0x08c4d172937054a861388be461d482bd4915dcda';

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
				var boardNumber = res.events.GameID.returnValues._boardNumber;
				document.cookie = `boardNumber=${boardNumber}`;
			});
	};

	// get game state of the current board number
	const getGameState = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.Games(boardNumber)
			.call({
				from: currentUser,
			})
			.then(async (res) => {
				console.log(res);
				const json = JSON.stringify(res);
				const parsed = JSON.parse(json);
				console.log('Parsed: ', parsed.bet);
				document.cookie = `bet=${Moralis.Units.FromWei(parsed.bet)}`;
				document.cookie = `checkState=${parsed.currState}`;
			});
	};

	// Initialize Game as Black (1)
	const initGameBlack = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.initGameBlack(boardNumber)
			.send({
				from: currentUser,
			})
			.then((res) => {
				console.log('Both Players joined ' + boardNumber + ' board ');
			});
	};

	// White Deposit to the contract
	const whiteDeposit = async (boardNumber, amount) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.whiteDeposit(boardNumber)
			.send({
				from: currentUser,
				value: Moralis.Units.ETH(amount),
			})
			.then((res) => {
				console.log('White deposited ' + amount + ' to the contract');
			});
	};

	// Black Deposit to the contract
	const blackDeposit = async (boardNumber, amount) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.blackDeposit(boardNumber)
			.send({
				from: currentUser,
				value: Moralis.Units.ETH(amount),
			})
			.then((res) => {
				console.log('Black deposited ' + amount + ' to the contract');
			});
	};

	// White Withdraw from the contract
	const whiteWithdraw = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.whiteWithdraw(boardNumber)
			.send({
				from: currentUser,
			})
			.then((res) => {
				console.log('White withdrew from the contract');
			});
	};

	// White Won
	const whiteWon = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.whiteWon(boardNumber)
			.send({
				from: currentUser,
			})
			.then((res) => {
				console.log('White won the game');
			});
	};

	// Black Won
	const blackWon = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.blackWon(boardNumber)
			.send({
				from: currentUser,
			})
			.then((res) => {
				console.log('Black won the game');
			});
	};

	// Release all funds
	const releaseAllFunds = async (boardNumber) => {
		await window.ethereum.enable();
		var CheckMatic = new web3.eth.Contract(ABI, contractAddress);
		const currentUser = user.attributes.ethAddress;
		const id = await CheckMatic.methods
			.releaseAllFunds(boardNumber)
			.send({
				from: currentUser,
			})
			.then((res) => {
				console.log('All funds released');
			});
	};

	return {
		initGameWhite,
		getGameState,
		initGameBlack,
		whiteDeposit,
		blackDeposit,
		whiteWithdraw,
		whiteWon,
		blackWon,
		releaseAllFunds,
	};
};
