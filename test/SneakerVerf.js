const SneakerAuth = artifacts.require("SneakerAuth");

contract("SneakerAuth", (accounts) => {
    let sneakerAuth;
    const admin = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    
    before(async () => {
        sneakerAuth = await SneakerAuth.deployed();
    });

    it("allows the admin to register a sneaker", async () => {
        await sneakerAuth.registerSneaker("Adidas Boost", "Model Y", "SN789012", { from: admin });
        const sneaker = await sneakerAuth.sneakers(1);
        
        assert.equal(sneaker.name, "Adidas Boost", "The name of the sneaker does not match.");
        assert.equal(sneaker.model, "Model Y", "The model of the sneaker does not match.");
        assert.equal(sneaker.serialNumber, "SN789012", "The serial number of the sneaker does not match.");
        assert.equal(sneaker.owner, admin, "The owner of the sneaker should be the admin.");
    });

    it("emits a SneakerRegistered event when a sneaker is registered", async () => {
        const result = await sneakerAuth.registerSneaker("Nike Air", "Model X", "SN123456", { from: admin });
        assert.equal(result.logs[0].event, "SneakerRegistered", "SneakerRegistered event was not emitted.");
    });

    it("allows sneakers to be verified", async () => {
        const sneaker = await sneakerAuth.verifySneaker(1);
        assert.equal(sneaker.serialNumber, "SN789012", "Sneaker verification failed or returned incorrect serial number.");
    });

    it("prevents non-owners from transferring sneakers", async () => {
        try {
            await sneakerAuth.transferOwnership(1, user2, { from: user1 });
            assert.fail("Non-owner was able to transfer the sneaker.");
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "Expected revert not found: " + error.message);
        }
    });

    it("allows the owner to transfer a sneaker to another user", async () => {
        await sneakerAuth.transferOwnership(1, user1, { from: admin });
        const sneaker = await sneakerAuth.sneakers(1);
        assert.equal(sneaker.owner, user1, "Ownership was not transferred to the new owner.");
    });

    it("emits an OwnershipTransferred event when ownership is transferred", async () => {
        const result = await sneakerAuth.transferOwnership(1, user2, { from: user1 });
        assert.equal(result.logs[0].event, "OwnershipTransferred", "OwnershipTransferred event was not emitted.");
    });

    // Additional tests can be added here for more edge cases and functionalities
});
