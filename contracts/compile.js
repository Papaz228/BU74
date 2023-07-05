const fs = require('fs');
const solc = require('solc');

function myCompiler(solc, fileName, contractName, contractCode) {
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



    let ABI = output.contracts[fName][contractName].abi;
    let bytecode = output.contracts[fName][contractName].evm.bytecode.object;
   
    fs.writeFileSync(__dirname + '/' + contractName + '.abi', JSON.stringify(ABI));
    fs.writeFileSync(__dirname + '/' + contractName + '.bin', bytecode);

}

let fName = "example.sol";
let cName = "Example";

let cCode = fs.readFileSync(__dirname + "/" + fName, "utf-8")
try {
    myCompiler(solc, fName, cName, cCode)
} catch (err) {
    console.log(err);
 
    let compileVers = 'v0.8.15+commit.e14f2714'
    solc.loadRemoteVersion(compileVers, (err, solcSnapshot) => {
        if (err) {
            console.log(err);
        } else {
            myCompiler(solcSnapshot, fName, cName, cCode)
        }
    })
}