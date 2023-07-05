const fs = require('fs');
const solc = require('solc');

function myCompiler(solc, fileName, contractName, contractCode) {
    // настраиваем структуру input для компилятора
    let input = {
        language: 'Solidity',
        sources: {
            [fileName]: {
                content: contractCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    var output = JSON.parse(solc.compile(JSON.stringify(input)));

    //console.log("Compilation result: ", output);
    //console.log("Compilation result: ", output.contracts[fName]);

    let ABI = output.contracts[fName][contractName].abi;
    let bytecode = output.contracts[fName][contractName].evm.bytecode.object;
    // console.log(ABI);
    // console.log(bytecode);

    fs.writeFileSync(__dirname + '/' + contractName + '.abi', JSON.stringify(ABI));
    fs.writeFileSync(__dirname + '/' + contractName + '.bin', bytecode);

    // `output` here contains the JSON output as specified in the documentation
    // for (var contractName in output.contracts['test.sol']) {
    //     console.log(
    //         contractName + ': ' +
    //         output.contracts['test.sol'][contractName].evm.bytecode.object
    //     );
    // }
}

let fName = "example.sol";
let cName = "Example";

// считываем код контракта из файла
let cCode = fs.readFileSync(__dirname + "/" + fName, "utf-8")
//console.log(cCode);
try {
    myCompiler(solc, fName, cName, cCode)
} catch (err) {
    console.log(err);
    // let solcx = solc.setupMethods(require('soljson -v0.8.15+commit.e14f2714'))
    // myCompiler(solcx, fName, cName, cCode)

    let compileVers = 'v0.8.15+commit.e14f2714'
    solc.loadRemoteVersion(compileVers, (err, solcSnapshot) => {
        if (err) {
            console.log(err);
        } else {
            myCompiler(solcSnapshot, fName, cName, cCode)
        }
    })
}

// если хотите автоматически, то попробуйте 
// const abi = await web3.eth.getAbi(address);