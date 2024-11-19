let web3;

async function loadWeb3AndContract() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Wallet connected.');
            // Initialize your contract here after ensuring web3 is available
            loadContract();
        } catch (error) {
            console.error("User denied account access.", error);
        }
    } else {
        console.log('Ethereum wallet is not detected. Please install MetaMask.');
    }
}

document.addEventListener('DOMContentLoaded', loadWeb3AndContract);

async function loadContract() {
    try {
        const response = await fetch('/build/contracts/SneakerAuth.json');
        const data = await response.json();
        const contractAddress = ''; // Make sure this is updated
        const sneakerAuth = new web3.eth.Contract(data.abi, contractAddress);
        return sneakerAuth;
    } catch (error) {
        console.error("Failed to load contract.", error);
    }
}


async function verifySneakerBySerial() {
    const serialNumber = document.getElementById('sneakerIdToVerify').value.trim();
    const contract = await loadContract();
    
    try {
        const sneaker = await contract.methods.verifySneakerBySerialNumber(serialNumber).call();
        
        const details = `
            <p><strong>ID:</strong> ${sneaker.id}</p>
            <p><strong>Name:</strong> ${sneaker.name}</p>
            <p><strong>Model:</strong> ${sneaker.model}</p>
            <p><strong>Serial Number:</strong> ${sneaker.serialNumber}</p>
            <p><strong>Owner:</strong> ${sneaker.owner}</p>
        `;
        document.getElementById('sneakerDetails').innerHTML = details;
    } catch (error) {
        console.error('Error verifying sneaker:', error);
        document.getElementById('sneakerDetails').textContent = 'Failed to verify sneaker. Please check the serial number and try again.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('verifySneakerButton').addEventListener('click', verifySneakerBySerial);
});