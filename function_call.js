const { Web3 } = require("web3");
require('dotenv').config();

const network = process.env.ETHEREUM_NETWORK
const api = process.env.INFURA_API_KEY

const provider = `https://${network}.infura.io/v3/${api}`;
const web3 = new Web3(provider);

const contractAddress = '0x00033e1d3D6e5be331964D85caF2e5CDeDE4E85C'
const senderAddress = process.env.SENDER_ADDRESS
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY

const abi = require("./MyToken.json");

const myContract = new web3.eth.Contract(abi, contractAddress);

const txParams = {
    from: senderAddress,
    to: contractAddress,
    data: myContract.methods.latestTransferHumanReadable().encodeABI(),
    gas: 200000,
    gasPrice: '100000000000'
};
const run = async () => {
    try {
        const result = await myContract.methods.latestTransferHumanReadable().call();
        console.log(`latestTransferHumanReadable: ${result}`);

        const signedTx = await web3.eth.accounts.signTransaction(txParams, senderPrivateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);
        console.log("Transaction was successful");
    } catch (error) {
        console.error("ERROR: ", error);
    }
}

run();