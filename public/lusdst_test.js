// ref: https://stackoverflow.com/a/13317405
var this_filename = location.pathname.split('/').slice(-1)[0]

/* =================================
   LOADER
=================================== */
// makes sure the whole site is loaded
jQuery(window).load(function() {
    console.log("ENTER: 'jQuery(window).load' _ filename: "+ this_filename)    
    window.web3 = new Web3(window.ethereum);
    get_trinity_balance()
})

// Contract address
// # tLUSDst_0.4: 0x014D7caE54F7fDd22eBac48C049F64271b84c8b4
// # tLUSDst_1.1: 0x9e68d69bddf821a0ecb4f993c6430c3ecbae69fb
// # LUSDst: ...
const contractAddress = '0x9e68d69bddf821a0ecb4f993c6430c3ecbae69fb';
const GAS_LIMIT = 938000; // # gas used: 838,000+
const MAX_PRIOR_FEE = 500000000000;

/******************************************************/
/* BLOCKCHAIN SUPPORT
/******************************************************/
// async function exe_write_contract(data) {
async function exe_write_contract(_func_hash, _arr_inp_types, _arr_inp_params) {
    // Get the current account
    console.log('getAccounts ... ')
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('getAccounts ... DONE')

    // // Create the transaction data & Encode via function hash
    console.log('encoding functin call ...') // '.slice(2)' = remove '0x' prefix from the encoded parameters
    // const data = functionHash + web3.eth.abi.encodeParameters(['uint64'], [bst_amount]).slice(2); 
    const data = _func_hash + web3.eth.abi.encodeParameters(_arr_inp_types, _arr_inp_params).slice(2);

    // encode via function signature w/ params
    // const data = web3.eth.abi.encodeFunctionCall({
    //     name: 'tradeInBST',
    //     type: 'function',
    //     inputs: [
    //         { type: 'uint64', name: '_bstAmnt' },
    //     ]
    // }, [bst_amount]);
    console.log('encoding functin call ... DONE')
    try {
        // Send the transaction
        console.log('building tx w/ gas price ... here we go! this should work')
        const options = {
            from: account,
            to: contractAddress,
            data: data.slice(2),
            // value: 'VALUE_IN_WEI',
            gas: GAS_LIMIT, // Set your desired gas limit here
            // gasPrice: ,
            maxPriorityFeePerGas: MAX_PRIOR_FEE,
        };
        console.log('building tx ... DONE')
        console.log('sending tx ...')
        await web3.eth.sendTransaction(options)
        .on('transactionHash', function(hash){
            console.log("Transaction hash LFG :", hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("Confirmation number:", confirmationNumber);
        })
        .on('receipt', function(receipt){
            console.log("Transaction receipt:", receipt);
        })
        .on('error', console.error);

        console.log('sending tx ... DONE')
        console.log('Function invoked successfully!');
    } catch (error) {
        if (error.message.includes('The send transactions "from" field must be defined!')) {
            // 'Error: The send transactions "from" field must be defined!'
            alert('\nSomething went wrong.\n\n Try refreshing the page or re-connecting your wallet.\n And then try again.')
        } else {
            alert('transaction aborted')
        }
    }
}

async function readFromContract(web3, contractAddress, _abi, functionHash, inputValues) {
    try {
        const contract = new web3.eth.Contract(_abi, contractAddress);
        // Call the contract function
        const result = await contract.methods[functionHash](...inputValues).call();
        console.log('Contract function result:', result);
        return result; // Return the result if needed
    } catch (error) {
        console.error('Error:', error);
        // Handle errors if needed
    }
}

async function get_trinity_balance() {
    // Get the current account
    console.log('getAccounts ... ')
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('getAccounts ... DONE')

    const functionSignature = "ACCT_USD_BALANCES(address)";
    const functionHash = "0xc67483dc";
    const inputTypes = ["address"];
    const outputTypes = ["uint64"];
    
    // Create a temporary ABI with the function signature and output type
    const temporaryAbi = [{
        "constant": true,
        "inputs": [{ "name": "_address", "type": "address" }],
        "name": functionSignature,
        "outputs": [{ "name": "", "type": "uint64" }],
        "type": "function"
    }];

    // Example usage
    // const contractAddress = "0x123..."; // Replace with your contract address
    const userAddress = account; // Replace with user address
    const result = await readFromContract(web3, contractAddress, temporaryAbi, functionHash, [userAddress]);
    console.log('ACCT_USD_BALANCES result:', result);
    const usdBalance = result / 1000000; // Divide by 10^6 to move the decimal 6 places left
    $('#wallet-addr').text(account);
    $('#usd-balance').text(usdBalance.toFixed(6));
    
}

/******************************************************/
/* MISC SUPPORT
/******************************************************/
function str_float_to_contr_input(_str_float, _pow) {
    console.log("_str_float: "+_str_float)
    var float_parse = parseFloat(_str_float); // conver string to float
    console.log("float_parse: "+float_parse)
    if (!isNaN(float_parse)) { // validate conversion
        var result = parseInt(float_parse * Math.pow(10, _pow)); // raise float to power of 10^_pow
        console.log("str_float_to_contr_input -> result: "+result);
        return result
    } else {
        console.error('str_float_to_contr_input -> err: Invalid input!');
        alert('\ninvalid number input, please try again')
        return -1
    }
}
function isValidHashAddress(str) {
    // Regular expression to check if the string starts with '0x' followed by hexadecimal characters
    var regex = /^0x[a-fA-F0-9]+$/;
    
    // Test the string against the regular expression
    return typeof str === 'string' && regex.test(str);
}
function set_trinity_usd_bal() {
    var bal = get_trinity_balance()
    const usdBalance = parseFloat(int(bal)).toFixed(6);
    $('#usd-balance').text(usdBalance);
}
function wallet_connect_update() {
    console.log('attempting to updated wallet connects ... ')
    if (window.ethereum) {
        window.ethereum
            .send('wallet_requestPermissions', [{ eth_accounts: {} }])
            .then(function (permissions) {
                alert('Updated Wallets Connected');
                get_trinity_balance()
            })
            .catch(function (error) {
                console.error("Error with wallet connect: ", error);
            });
    } else {
        // MetaMask not detected
        console.error("MetaMask is not installed or not logged in.");
    }
    console.log('attempting to updated wallet connects ... DONE')
}

/******************************************************/
/* NETWORK REQUEST SUPPORT
/******************************************************/

/******************************************************/
/* EVENT HANLDERS (BUTTON CLICKS)
/******************************************************/
$('#connect-wallet').click(function() {
    wallet_connect_update()
})
$('#connect-wallet-1').click(function() {
    wallet_connect_update()
})
$('#payout-handle').click(function() {
    // Function hash of do_something function
    // "payOutBST(uint64,address,address,bool)": ["5c1b4b51", ["uint64","address","address","bool"], []], # gas used: ?
    const func_hash = '0x5c1b4b51'; // Replace with the function hash of do_something

    var usd_amnt_str = $('#payout-usd-amount').val()
    var to_addr = $('#payout-to-address').val()
    var aux_tok_addr = "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0" // pLUSD
    var bool_sel_send = false; 

    usd_amnt_uint = str_float_to_contr_input(usd_amnt_str, 6) // 6 == 10^6
    valid_to_addr = isValidHashAddress(to_addr)
    valid_aux_tok_addr = isValidHashAddress(aux_tok_addr) || aux_tok_addr.length == 0

    if (valid_to_addr && valid_aux_tok_addr) {    
        var message = "\nAre you sure this is correct?"; // Your main message
        message += "\n\n  USD buy & burn amount (for pLUSD): " + usd_amnt_str + " (" + usd_amnt_uint +")";
        message += "\n  LUSDst reward address: " + to_addr;
        to_addr = web3.utils.toChecksumAddress(to_addr), // Ensure address is properly checksummed
        aux_tok_addr = web3.utils.toChecksumAddress(aux_tok_addr)
        arr_inp_types = ['uint64',"address","address",'bool']
        arr_inp_params = [usd_amnt_uint,to_addr,aux_tok_addr,bool_sel_send]
        var result = window.confirm(message);
        if (result) {
            exe_write_contract(func_hash, arr_inp_types, arr_inp_params)
        }
    } else {
        alert("error: invalid input")
    }
})
