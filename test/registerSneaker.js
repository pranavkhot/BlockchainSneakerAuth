const SneakerAuth = artifacts.require("SneakerAuth");

contract("SneakerAuth - Register Sneaker", (accounts) => {
    let sneakerAuth;
    const admin = accounts[0];
    const nonAdmin = accounts[1];

    before(async () => {
        sneakerAuth = await SneakerAuth.deployed();
    });

    describe("Admin registers a sneaker", () => {
        it("should allow the admin to successfully register a sneaker", async () => {
            const tx = await sneakerAuth.registerSneaker("Adidas Boost", "Model Y", "SN789012", { from: admin });
            assert(tx.receipt.status, 'Transaction failed');

            // Check for SneakerRegistered event emission
            assert.equal(tx.logs[0].event, "SneakerRegistered", "SneakerRegistered event was not emitted.");
            
            const sneakerId = tx.logs[0].args.id.toNumber(); // Assuming the event logs the sneaker ID.
            const sneaker = await sneakerAuth.sneakers(sneakerId);
            
            console.log(`Sneaker Details:
                ID: ${sneaker.id.toString()},
                Name: ${sneaker.name},
                Model: ${sneaker.model},
                Serial Number: ${sneaker.serialNumber},
                Owner: ${sneaker.owner}`);

            assert.equal(sneaker.name, "Adidas Boost", "The name of the sneaker does not match.");
            assert.equal(sneaker.model, "Model Y", "The model of the sneaker does not match.");
            assert.equal(sneaker.serialNumber, "SN789012", "The serial number of the sneaker does not match.");
            assert.equal(sneaker.owner, admin, "The owner of the sneaker should be the admin.");
        });
    });

    describe("Non-admin attempts to register a sneaker", () => {
        it("should prevent non-admin users from registering a sneaker", async () => {
            try {
                await sneakerAuth.registerSneaker("Nike Air", "Model X", "SN123456", { from: nonAdmin });
                assert.fail("Expected error not thrown");
            } catch (error) {
                assert(error.message.indexOf('revert') >= 0, "Expected revert not found: " + error.message);
            }
        });
    });

    describe("Registering a sneaker with a duplicate serial number", () => {
        it("should prevent registration of a sneaker with an already registered serial number", async () => {
            // First registration by the admin should succeed.
            await sneakerAuth.registerSneaker("Yeezy Boost", "Model Z", "SN987654", { from: admin });

            // Attempt to register another sneaker with the same serial number.
            try {
                await sneakerAuth.registerSneaker("Yeezy Boost", "Model Z", "SN987654", { from: admin });
                assert.fail("Expected error not thrown");
            } catch (error) {
                assert(error.message.indexOf('revert') >= 0 && error.message.indexOf('Sneaker already registered') >= 0, "Expected 'Sneaker already registered' error not found: " + error.message);
            }
        });
    });
});
