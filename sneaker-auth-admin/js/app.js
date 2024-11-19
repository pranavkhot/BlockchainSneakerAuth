let web3;

async function loadWeb3() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            console.log('Wallet connected.');
            // Enable the register button only after the wallet is connected
            document.getElementById('registerSneakerButton').disabled = false;
            document.getElementById('statusMessage').textContent = 'Wallet connected. You can now register sneakers.';
        } catch (error) {
            console.error("User denied account access or an error occurred.", error);
            document.getElementById('statusMessage').textContent = 'Failed to connect wallet. Please try again.';
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        document.getElementById('statusMessage').textContent = 'MetaMask is not installed. Please install it to use this DApp.';
    }
}

async function loadContract() {
    try {
        const response = await fetch('/build/contracts/SneakerAuth.json'); // Make sure the path to your ABI is correct.
        const data = await response.json();
        
        // The address should be updated according to your contract deployment.
        const contractAddress = ''; 
        const sneakerAuth = new web3.eth.Contract(data.abi, contractAddress);
        
        return sneakerAuth;
    } catch (error) {
        console.error("Failed to load contract.", error);
    }
}

async function registerSneaker() {
    if (!web3) {
        console.log('Web3 is not initialized. Make sure MetaMask is connected.');
        return;
    }

    const sneakerName = document.getElementById('sneakerName').value;
    const sneakerModel = document.getElementById('sneakerModel').value;
    const sneakerSerialNumber = document.getElementById('sneakerSerialNumber').value;
    
    const contract = await loadContract();
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
        console.error("No accounts found. Make sure Ethereum client is accessible.");
        return;
    }

    // Estimating Gas
    let estimatedGas;
    try {
        estimatedGas = await contract.methods.registerSneaker(sneakerName, sneakerModel, sneakerSerialNumber).estimateGas({ from: accounts[0] });
    } catch (error) {
        console.error('Error estimating gas:', error);
        document.getElementById('statusMessage').textContent = 'Failed to estimate gas. See console for more details.';
        return;
    }

    // Sending Transaction
    contract.methods.registerSneaker(sneakerName, sneakerModel, sneakerSerialNumber).send({ from: accounts[0], gas: estimatedGas })
        .then((receipt) => {
            console.log('Transaction receipt:', receipt);
            document.getElementById('statusMessage').textContent = 'Sneaker registered successfully!';
        })
        .catch((error) => {
            console.error('Error registering sneaker:', error);
            document.getElementById('statusMessage').textContent = 'Failed to register sneaker. See console for more details.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWalletButton').addEventListener('click', loadWeb3);
    document.getElementById('registerSneakerButton').addEventListener('click', registerSneaker);
});
