const SneakerAuth = artifacts.require("SneakerAuth");

contract("SneakerAuth - Transfer Ownership", (accounts) => {
    let sneakerAuth;
    const admin = accounts[0];
    const newOwner = ""; // Placeholder for the new owner's address

    before(async () => {
        sneakerAuth = await SneakerAuth.deployed();
        // Register a sneaker as an admin before each test
        await sneakerAuth.registerSneaker("Adidas Boost", "Model Y", "SN789012", { from: admin });
    });

    describe("Transfer ownership of a sneaker", () => {
        it("should allow the current owner to transfer ownership to another account", async () => {
            const sneakerId = 1; // Assuming this is the ID of the sneaker registered in the before hook

            const tx = await sneakerAuth.transferOwnership(sneakerId, newOwner, { from: admin });
            assert(tx.receipt.status, 'Transaction failed');

            // Check for OwnershipTransferred event emission
            assert.equal(tx.logs[0].event, "OwnershipTransferred", "OwnershipTransferred event was not emitted.");
            assert.equal(tx.logs[0].args.from, admin, "The 'from' address in the event is incorrect.");
            assert.equal(tx.logs[0].args.to, newOwner, "The 'to' address in the event is incorrect.");

            // Fetch the updated sneaker details
            const sneaker = await sneakerAuth.sneakers(sneakerId);
            
            console.log(`Sneaker Ownership Details After Transfer:
                ID: ${sneaker.id.toString()},
                Name: ${sneaker.name},
                Model: ${sneaker.model},
                Serial Number: ${sneaker.serialNumber},
                Current Owner: ${sneaker.owner}`);

            assert.equal(sneaker.owner, newOwner, "Ownership was not transferred to the new owner.");
        });
    });

    // Additional tests for edge cases and failure modes can be added here
});
