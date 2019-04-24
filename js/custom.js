let currentProvider = new ethers.providers.JsonRpcProvider('https://rpc-bitfalls1.lisinski.online', 385);

let abiRobocop = [
	{
		"constant": false,
		"inputs": [],
		"name": "voteLegolas",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "voteRobocop",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "votesLegolas",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "votesRobocop",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

let abiVote = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "vote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "votes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

let pk = getUrlParameter('pk');
let wallet;
if (pk) {
    wallet = new ethers.Wallet(pk);
} else {
    wallet = ethers.Wallet.createRandom();
    pk = wallet.privateKey;
}
wallet = wallet.connect(currentProvider);
let robocopContractAddress = "0x971d888b63b245bb8312bdc735de78c72b142db0";
let ubikContractAddress = "0x3a62d161a5b4a7e8a1539a52d49903625b90eb64";

let robocopContract = new ethers.Contract(robocopContractAddress, abiRobocop, wallet);
let ubikContract = new ethers.Contract(ubikContractAddress, abiVote, wallet);

async function getBalance() {
    currentProvider.getBalance(wallet.address).then((balance) => {
        // balance is a BigNumber (in wei); format is as a string (in ether)
        let etherString = ethers.utils.formatEther(balance);

        console.log("Address: " + wallet.address);
        console.log("Balance: " + etherString);
        document.querySelector("#thisAddress").innerHTML = "<a href='https://preglednik.lisinski.online/account/"+wallet.address+"' target='_blank'>"+wallet.address+"</a>";
        document.querySelector("#stanje").innerText = etherString;
        document.querySelector(".osnove").style = "display: block";
    });
}

setInterval(function(){
    getBalance();
    getVotes();
}, 5000);

async function getVotes() {
	let robocopVotes = await robocopContract.votesRobocop();
	let legolasVotes = await robocopContract.votesLegolas();
	let ubikVotes = await ubikContract.votes();

	robocopContract.hasVoted(wallet.address).then(function(result) {
		console.log(result);
		if (!result && localStorage.getItem("votedForrobocop") !== "true" && localStorage.getItem("votedForlegolas") !== "true") {
			$(".robolas button").attr("disabled", false);
		} else {
			$(".robolas button").attr("disabled", "disabled");
		}
	});

	ubikContract.hasVoted(wallet.address).then(function(result){
		console.log(result);
		if (!result && localStorage.getItem("votedForubik") !== "true") {
			$(".ubik button").attr("disabled", false);
		} else {
			$(".ubik button").attr("disabled", "disabled");
		}
	});

	document.getElementById("robocopButton").innerText = "Robocop " + robocopVotes;
	document.getElementById("legolasButton").innerText = "Legolas " + legolasVotes;
	document.getElementById("ubikButton").innerText = "Glasova ZA kandidacijsku listu broj 1: " + ubikVotes;
}

document.querySelector("#robocopButton").addEventListener("click", castVote);
document.querySelector("#legolasButton").addEventListener("click", castVote);
document.querySelector("#ubikButton").addEventListener("click", castVote);

function castVote(e) {
	localStorage.setItem("votedFor"+e.currentTarget.dataset.choice, true);
	voteFor(e.currentTarget.dataset.choice);
	$(e.currentTarget).parent().find("button").attr("disabled", "disabled").text("Glasam...");
}

async function voteFor(string) {
	let tx;
	switch (string) {
		case "robocop":
			tx = robocopContract.voteRobocop();
		break;
		case "legolas":
			tx = robocopContract.voteLegolas();
		break;
		case "ubik":
			tx = ubikContract.vote();
		break;
		default:
			//return false;
	}
	console.log(tx);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function slugify(someString) {
    return ethers.utils.id(someString).slice(0, 7);
}