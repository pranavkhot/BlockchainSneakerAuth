const SneakerAuth = artifacts.require("SneakerAuth");

contract("SneakerAuth - Verify Sneaker", (accounts) => {
    let sneakerAuth;
    const admin = accounts[0];

    before(async () => {
        sneakerAuth = await SneakerAuth.new();
    });

    describe("Verify existing sneaker", () => {
        it("should verify a sneaker that has been registered", async () => {
            // First, register a sneaker
            await sneakerAuth.registerSneaker("Adidas Boost", "Model Y", "SN789012", { from: admin });
            
            // Then, verify the sneaker
            const sneakerId = 1; // Assuming the first registered sneaker has ID 1
            const sneaker = await sneakerAuth.verifySneaker(sneakerId);

            console.log(`Verified Sneaker Details:
                ID: ${sneakerId},
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

    describe("Verify non-existent sneaker", () => {
        it("should fail to verify a sneaker that has not been registered", async () => {
            try {
                const nonExistentSneakerId = 999; // An ID that is not registered
                await sneakerAuth.verifySneaker(nonExistentSneakerId);
                assert.fail("Expected error not thrown");
            } catch (error) {
                assert(error.message.indexOf('revert') >= 0, "Expected revert not found: " + error.message);
            }
        });
    });
});
