let web3;
let sneakerAuthContract;

async function loadWeb3AndContract() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Wallet connected.');
            await loadContract(); // Await the contract loading
        } catch (error) {
            console.error("User denied account access.", error);
        }
    } else {
        console.log('Ethereum wallet is not detected. Please install MetaMask.');
    }
}

async function loadContract() {
    const response = await fetch('/build/contracts/SneakerAuth.json');
    const data = await response.json();
    const contractAddress = ''; // Ensure this is the correct contract address
    sneakerAuthContract = new web3.eth.Contract(data.abi, contractAddress);
}

async function transferOwnershipBySerial() {
    // Ensure web3 is initialized
    if (!web3) {
        console.log('web3 is not initialized. Make sure you are connected to MetaMask.');
        return;
    }

    const serialNumber = document.getElementById('sneakerSerial').value.trim();
    const newOwnerAddress = document.getElementById('newOwnerAddress').value.trim();
    const transferStatusEl = document.getElementById('transferStatus');

    try {
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Wallet not connected");

        const sneakerId = await sneakerAuthContract.methods.serialNumberToSneakerId(serialNumber).call();
        if (sneakerId === "0") throw new Error("Sneaker not found");

        await sneakerAuthContract.methods.transferOwnership(sneakerId, newOwnerAddress).send({ from: accounts[0] });

        // Optionally fetch sneaker details again to confirm the new owner, if necessary

        transferStatusEl.innerHTML = `
            <p>Ownership of <strong>${serialNumber}</strong> transferred successfully to ${newOwnerAddress}.</p>
        `;
    } catch (error) {
        console.error('Error transferring ownership:', error);
        transferStatusEl.textContent = 'Failed to transfer ownership. ' + error.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadWeb3AndContract();
    document.getElementById('transferOwnershipButton').addEventListener('click', transferOwnershipBySerial);
});
