let currentProvider = new ethers.providers.JsonRpcProvider('https://rpc-bitfalls1.lisinski.online', 385);

let abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pollName",
				"type": "string"
			},
			{
				"name": "optionSlug",
				"type": "string"
			},
			{
				"name": "optionDescription",
				"type": "string"
			}
		],
		"name": "addOption",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "finalizePoll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "hidePoll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			}
		],
		"name": "initPoll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "startPoll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pollName",
				"type": "string"
			},
			{
				"name": "optionSlug",
				"type": "string"
			}
		],
		"name": "vote",
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
				"name": "name",
				"type": "string"
			}
		],
		"name": "getNumOptions",
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
		"inputs": [
			{
				"name": "pollName",
				"type": "string"
			},
			{
				"name": "optionSlug",
				"type": "string"
			}
		],
		"name": "getNumVotes",
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
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "optionIndex",
				"type": "uint256"
			}
		],
		"name": "getOptionForPoll",
		"outputs": [
			{
				"components": [
					{
						"name": "slug",
						"type": "string"
					},
					{
						"name": "description",
						"type": "string"
					}
				],
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "isAdmin",
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
		"name": "pollCount",
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
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "polls",
		"outputs": [
			{
				"name": "label",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "visible",
				"type": "bool"
			},
			{
				"name": "finalized",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

let pk = getUrlParameter('pk');
let wallet;
if (pk) {
    wallet = new ethers.Wallet(pk);
} else {
    wallet = ethers.Wallet.createRandom();
    pk = wallet.privateKey;
}
wallet = wallet.connect(currentProvider);
let contractAddress = "0xfa1e05d90ba6fa2a921279e07de753d618c83f51";
let contract = new ethers.Contract(contractAddress, abi, wallet);

async function getBalance() {
    currentProvider.getBalance(wallet.address).then((balance) => {
        // balance is a BigNumber (in wei); format is as a string (in ether)
        let etherString = ethers.utils.formatEther(balance);

        console.log("Address: " + wallet.address);
        console.log("Balance: " + etherString);
        document.querySelector("#thisAddress").innerText = wallet.address;
        document.querySelector("#stanje").innerText = etherString;
        document.querySelector(".osnove").style = "display: block";
    });
}

setInterval(function(){
    getBalance();
    getPolls();
}, 3000);

async function getPolls() {
    contract.pollCount().then(function(result){
        if (result > 0) {
            for (var i = 0; i < result; i++) {
                contract.polls(i).then(function(currentPoll){
                    renderPoll(currentPoll);
                });
            }
        }
    });
}

async function renderPoll(currentPoll) {

    console.log(currentPoll);
}

let rowTemplate = document.querySelector("template#optionTemplate");
document.querySelector("#addRowLinks").addEventListener("click", function(e) {
    var clone = document.importNode(rowTemplate.content, true);
    document.querySelector(".opcije").appendChild(clone);
});

async function findOutIfAdmin(address) {
    let currentValue = await contract.isAdmin(address);
    console.log(currentValue);
    if (currentValue) {
        $(".admins").show();
    }
}
findOutIfAdmin(wallet.address);

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    return false;
}, false);

document.querySelector("#adminToggle").addEventListener("click", function() {
    $(".admins.hideable").toggle();
})

document.querySelector("#addAdminButton").addEventListener("click", function(e) {
    let newAdminAddress = document.querySelector("#addressOfAdmin").value;
    registerNewAdmin(newAdminAddress);
});

document.querySelector("#checkAdminButton").addEventListener("click", function(e) {
    let newAdminAddress = document.querySelector("#addressOfAdmin").value;
    if (newAdminAddress === "") {
        return false;
    }
    contract.isAdmin(newAdminAddress).then(function(result){
        if (result) {
            $(document.querySelector("#addressOfAdmin")).removeClass("is-danger");
            $(document.querySelector("#addressOfAdmin")).addClass("is-success");
        } else {
            $(document.querySelector("#addressOfAdmin")).removeClass("is-success");
            $(document.querySelector("#addressOfAdmin")).addClass("is-danger");
        }
    });
});

document.querySelector("#initPollButton").addEventListener("click", function(e) {
    let pollDesc = document.querySelector("#pollDescInput").value;
    if (pollDesc == "") {
        return false;
    }
    let pollName = slugify(pollDesc);
    console.log("Poll: " + pollName);
    createNewPoll(pollName, pollDesc);
});

async function registerNewAdmin(address) {
    let tx = await contract.addAdmin(address);
    console.log(tx.hash);
    await tx.wait();
    document.querySelector("#checkAdminButton").click();
}

async function createNewPoll(pollName, pollDesc) {
    let tx = await contract.initPoll(pollName, pollDesc);
    console.log(tx.hash);
    tx.wait().then(async function(result){
        // Get options
        console.log(result);
        let options = document.querySelectorAll(".opcije input");
        for (var i = 0; i < options.length; i++) {
            let option = options[i].value;
            if (option !== "") {
               let opttx = await addOption(pollName, option)
            }
        }
    });
}

async function addOption(pollName, option) {
    let slug = slugify(option);
    let tx = await contract.addOption(pollName, slug, option);
    console.log("Option " + slug + " for poll " + pollName + " at TX hash ".tx.hash);
    await tx.wait();
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