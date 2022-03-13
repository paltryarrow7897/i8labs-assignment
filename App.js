const contractAddress = "0x34515f0274332E654407339C4C83e547023fA0F6"
const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_userWallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_userName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_userAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_userDob",
				"type": "string"
			}
		],
		"name": "UserAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_userWallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_newName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_prevName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_newAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_prevAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_newDob",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_prevDob",
				"type": "string"
			}
		],
		"name": "UserEdit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userDob",
				"type": "string"
			}
		],
		"name": "addNew",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userDob",
				"type": "string"
			}
		],
		"name": "edit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewUser",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "userWallet",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userAddress",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userDob",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "userRegistered",
						"type": "bool"
					}
				],
				"internalType": "struct i8labs_assignment.userData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

var web3 = new Web3(window.ethereum);

const connect = document.getElementById('connect'); 
connect.onclick = async () => {
	let currentAccount = document.getElementById('currentAccount')
    await ethereum.request({ method: 'eth_requestAccounts'})
	currentAccount.innerText = "Connected: " + String(ethereum.selectedAddress)
}

const submitAdd = document.getElementById('submitAdd')
submitAdd.onclick = async () => {
	var web3 = new Web3(window.ethereum);

	const addName = document.getElementById('addName').value
	const addAddress = document.getElementById('addAddress').value
	const addDob = document.getElementById('addDob').value

	const myContract = new web3.eth.Contract(contractAbi, contractAddress)
	myContract.setProvider(window.ethereum)

	let addStatus = document.getElementById('addStatus')
	addStatus.innerText = "Waiting..."
	await myContract.methods.addNew(addName, addAddress, addDob).send({from: ethereum.selectedAddress})
	.on('confirmation', function(confirmationNumber, receipt) {
		addStatus.innerText = "Done";
	  })
	  .on('error', function(error, receipt) {
		addStatus.innerHTML = "Something happened, got this error: " + error.code + ":" + error.message;
	  });
}

const submitEdit = document.getElementById('submitEdit')
submitEdit.onclick = async () => {
	var web3 = new Web3(window.ethereum);

	const editName = document.getElementById('editName').value
	const editAddress = document.getElementById('editAddress').value
	const editDob = document.getElementById('editDob').value

	const myContract = new web3.eth.Contract(contractAbi, contractAddress)
	myContract.setProvider(window.ethereum)

	let editStatus = document.getElementById('editStatus')
	editStatus.innerText = "Waiting..."
	await myContract.methods.edit(editName, editAddress, editDob).send({from: ethereum.selectedAddress})
	.on('confirmation', function(confirmationNumber, receipt) {
		editStatus.innerHTML = "Done";
	  })
	  .on('error', function(error, receipt) {
		editStatus.innerHTML = "Something happened, got this error: " + error.code + ":" + error.message;
	  });
}

const submitView = document.getElementById('submitView')
submitView.onclick = async () => {
	var web3 = new Web3(window.ethereum)

	const myContract = new web3.eth.Contract(contractAbi, contractAddress)
	let userData = await myContract.methods.viewUser().call({from: ethereum.selectedAddress})
	let currName = userData.userName
	let currAddress = userData.userAddress
	let currDob = userData.userDob
	let current = document.getElementById('current')
	current.innerText = "Current =>  Name: " + currName + " || Address: " + currAddress + " || DOB: " + currDob

	let prevArray
	await myContract.getPastEvents('UserEdit', {
									filter: {_userWallet: ethereum.selectedAddress},
									fromBlock: "earliest",
									toBlock: "latest"})
											.then(function(events){prevArray = events})
	let previous = document.getElementById('previous')
	while (previous.firstChild) {
		previous.removeChild(previous.firstChild)
	}
	if (prevArray.length == 0) {
		previous.innerText = "No edits yet."
	}
	else {
		for (let i=prevArray.length-1; i>=0; i--) {
			let div = document.createElement('div')
			let prevName = prevArray[i].returnValues._prevName
			let prevAddress = prevArray[i].returnValues._prevAddress
			let prevDob = prevArray[i].returnValues._prevDob
			div.innerText = "Previous => " + i + " Name: " + prevName + " || Address: " + prevAddress + " || DOB: " + prevDob
			previous.appendChild(div)
		}
	} 
	console.log(prevArray)
	console.log(prevArray.length)
}