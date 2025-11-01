// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract VehicleWarrantyRegistry {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    mapping(address => bool) public isGarage; // can anchor service records
    mapping(address => bool) public isManufacturer; // can resolve claims

    event RoleUpdated(address indexed account, string role, bool enabled);

    function setGarage(address account, bool enabled) external onlyOwner {
        isGarage[account] = enabled;
        emit RoleUpdated(account, "GARAGE", enabled);
    }

    function setManufacturer(address account, bool enabled) external onlyOwner {
        isManufacturer[account] = enabled;
        emit RoleUpdated(account, "MANUFACTURER", enabled);
    }

    struct Claim {
        bytes32 vehicleId; // e.g., keccak256 of plate or VIN
        bytes32 contentHash; // off-chain claim payload hash
        address requester;
        bool resolved;
        bool approved;
        bytes32 resolutionHash; // hash of resolution document
    }

    uint256 public nextClaimId = 1;
    mapping(uint256 => Claim) public claims;

    event ServiceRecordAnchored(
        bytes32 indexed vehicleId,
        bytes32 indexed contentHash,
        address indexed garage,
        uint256 timestamp
    );

    event WarrantyClaimCreated(
        uint256 indexed claimId,
        bytes32 indexed vehicleId,
        bytes32 indexed contentHash,
        address requester
    );

    event WarrantyClaimResolved(
        uint256 indexed claimId,
        bool approved,
        bytes32 resolutionHash,
        address resolver
    );

    function anchorServiceRecord(bytes32 vehicleId, bytes32 contentHash) external {
        require(isGarage[msg.sender], "not garage");
        emit ServiceRecordAnchored(vehicleId, contentHash, msg.sender, block.timestamp);
    }

    function createWarrantyClaim(bytes32 vehicleId, bytes32 contentHash) external returns (uint256 id) {
        id = nextClaimId++;
        claims[id] = Claim({
            vehicleId: vehicleId,
            contentHash: contentHash,
            requester: msg.sender,
            resolved: false,
            approved: false,
            resolutionHash: bytes32(0)
        });
        emit WarrantyClaimCreated(id, vehicleId, contentHash, msg.sender);
    }

    function resolveWarrantyClaim(uint256 claimId, bool approved, bytes32 resolutionHash) external {
        require(isManufacturer[msg.sender], "not manufacturer");
        Claim storage c = claims[claimId];
        require(!c.resolved, "already resolved");
        c.resolved = true;
        c.approved = approved;
        c.resolutionHash = resolutionHash;
        emit WarrantyClaimResolved(claimId, approved, resolutionHash, msg.sender);
    }
}


