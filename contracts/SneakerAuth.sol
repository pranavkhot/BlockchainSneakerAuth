// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

contract SneakerAuth {
    address public admin;
    uint256 public nextSneakerId = 0;

    struct Sneaker {
        uint256 id;
        string name;
        string model;
        string serialNumber;
        address owner;
    }

    mapping(uint256 => Sneaker) public sneakers;
    mapping(string => uint256) public serialNumberToSneakerId;

    event SneakerRegistered(uint256 id, string serialNumber, address owner);
    event OwnershipTransferred(uint256 id, address from, address to);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerSneaker(string memory _name, string memory _model, string memory _serialNumber) external onlyAdmin {
        require(serialNumberToSneakerId[_serialNumber] == 0, "Sneaker already registered");
        nextSneakerId++;
        sneakers[nextSneakerId] = Sneaker(nextSneakerId, _name, _model, _serialNumber, admin);
        serialNumberToSneakerId[_serialNumber] = nextSneakerId;
        emit SneakerRegistered(nextSneakerId, _serialNumber, admin);
    }

    function verifySneaker(uint256 _sneakerId) external view returns (Sneaker memory) {
        require(_sneakerId <= nextSneakerId && _sneakerId != 0, "Sneaker does not exist.");
        return sneakers[_sneakerId];
    }

    function transferOwnership(uint256 _sneakerId, address _newOwner) external {
        require(_sneakerId <= nextSneakerId && _sneakerId != 0, "Sneaker does not exist.");
        Sneaker storage sneaker = sneakers[_sneakerId];
        require(msg.sender == sneaker.owner, "Only the sneaker's owner can transfer it.");
        sneaker.owner = _newOwner;
        emit OwnershipTransferred(_sneakerId, msg.sender, _newOwner);
    }

    // New function to verify sneaker by serial number
    function verifySneakerBySerialNumber(string memory _serialNumber) external view returns (Sneaker memory) {
        uint256 sneakerId = serialNumberToSneakerId[_serialNumber];
        require(sneakerId != 0, "Sneaker does not exist.");
        return sneakers[sneakerId];
    }
}
