import { createStore } from 'vuex';

import { multisigABI } from '@/contracts/Multisig.abi.js';
import { targetABI } from '@/contracts/Target.abi.js';

const ethers = require('ethers');
const jsprovider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/XdE1v9zVDSoRe6S5013cteykw1ZDC0u9");

export default createStore({
    state: {
        provider: {},
        admins: ["0xF86cbd8c36Fded13F403A1676396eCA9b0970587", "0xAa7BA90141352F9Cb3E2a717037984971DFfdaAD", "0xfd301bfd302308eddad20E02DaFfBf0775d5bB31"],
        admin: false,
        address: "",
        chainId: "",
        multisigAddress: "0x256c12bAaB6f6Efcf163f4F7BE6Ae72D1030a5b1",
        multisig: {},
        // targetAddress: "0xddaD96F0978F7757A8A66a6a312C2517b98A3331",
        // target: {},
        message: {},
        newMessage: false,
        enoughSignatures: false,
    },
    getters: {
        
    },
    mutations: {
        addBlock(state, newBlock){
            state.block.unshift(newBlock);
        },
    },
    actions: {
        async connectionWallet({state}) {
            if (typeof window.ethereum !== 'undefined') {
                console.log("Etherium client installed!");
                if (ethereum.isMetaMask === true) {
                    console.log("MetaMask connected!");
                    if (ethereum.isConnected() !== true) {
                        console.log("MetaMask is not connected!");
                        await ethereum.enable();
                    }
                    console.log("MetaMask connected");
                } else {
                    alert ("Metamask is not installed!")
                }
            } else {
                alert ("Ethereum client is not installed!")
            }

            await ethereum.request({ method: "eth_requestAccounts" })
            .then(accounts => {
                state.address = ethers.utils.getAddress(accounts[0]);
                if (state.admins.includes(state.address)) {
                    state.admin = true;
                } else {
                    state.admin = false;
                }
                console.log(`Account ${state.address} connected`);
            })
            
            state.provider = new ethers.providers.Web3Provider(ethereum);


            state.chainId = await window.ethereum.request({ method: "eth_chainId" });
            console.log("chainId: ", state.chainId);

            ethereum.on("accountsChanged", (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0]);
                if (state.admins.includes(state.address)) {
                    state.admin = true;
                } else {
                    state.admin = false;
                }
                console.log(`Accounts changed to ${state.address}`);
            })

            ethereum.on("chainChanged", async () => {
                state.provider = new ethers.providers.Web3Provider(ethereum);
                state.chainId = await window.ethereum.request({ method: "eth_chainId" });
                console.log("chainId changed to ", state.chainId);
            })
        },
        async newMessage({state}, args) {
            const [targetAddress, functionName, functionArgs] = args;
            console.log(targetAddress);
            console.log(functionName);
            console.log(functionArgs);

            let functionSignature = "function " + functionName + "(";
            for(let i = 0; i < functionArgs.types.length; i++) {
                functionSignature += functionArgs.types[i] + ",";
            }
            functionSignature = functionSignature.slice(0, -1) + ")";
            console.log("functionSignature: ", functionSignature);

            const iTarget = new ethers.utils.Interface([functionSignature]);
            console.log("iTarget: ", iTarget);

            const payload = iTarget.encodeFunctionData(functionName, functionArgs.args);
            console.log("payload: ", payload);

            state.multisig = new ethers.Contract(state.multisigAddress, multisigABI, jsprovider);
            const nonce = await state.multisig.nonce();
            console.log("nonce: ", nonce);

            const message = ethers.utils.arrayify(ethers.utils.solidityPack(
                ["uint256", "address", "address", "bytes"],
                [nonce, state.multisigAddress, targetAddress, payload]
            ));
     
            const signer = state.provider.getSigner();
            console.log("signer: ", signer);

            const rawSignature = await signer.signMessage(message);

            const signature = ethers.utils.splitSignature(rawSignature); 

            let signatures = { 
                v: [signature.v], 
                r: [signature.r], 
                s: [signature.s]
            };
            
            state.message = {
                targetAddress: targetAddress,
                functionName: functionName,
                functionArgs: functionArgs,
                nonce: nonce,
                payload: payload,
                message: message,
                signers: [state.address],
                signatures: signatures
            }

            state.newMessage = true;

            console.log("state.message: ", state.message);

        },
        async signMessage({state}) {
            const signer = state.provider.getSigner();
            console.log("signer: ", signer);

            const rawSignature = await signer.signMessage(state.message.message);

            const signature = ethers.utils.splitSignature(rawSignature); 

            state.message.signatures.v.push(signature.v);
            state.message.signatures.r.push(signature.r);
            state.message.signatures.s.push(signature.s);
            state.message.signers.push(state.address);

            console.log("New sign: ", signer.address);
            console.log("Sign count: ", state.message.signers.length);
            if(state.message.signers.length > state.admins.length / 2) {
                console.log("enough signatures");
                state.enoughSignatures = true;
            }
        },
        async sendMessage({state}) {
            const iMultisig = new ethers.utils.Interface(multisigABI);
            const data = iMultisig.encodeFunctionData("verify", 
            [
                state.message.nonce,
                state.message.targetAddress,
                state.message.payload,
                state.message.signatures.v,
                state.message.signatures.r,
                state.message.signatures.s
            ]);

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.multisigAddress,
                    data: data
                }]
            })
            console.log("txHash: ", txHash);

            
            const receipt = await jsprovider.waitForTransaction(txHash);
            console.log("receipt: ", receipt);

            const target = new ethers.Contract(state.message.targetAddress, targetABI, jsprovider);
            const number = await target.number();
            console.log("number: ", number);

            state.newMessage = false;
            state.enoughSignatures = false;
        }
    },
    modules: {

    } 
})