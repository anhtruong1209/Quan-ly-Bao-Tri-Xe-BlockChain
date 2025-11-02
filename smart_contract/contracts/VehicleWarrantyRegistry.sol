// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract VehicleWarrantyRegistry {
    address public owner;

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
        isUser[msg.sender] = true; // Owner cũng là user
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "not admin");
        _;
    }

    // Phân quyền mới: Admin và User
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isUser;

    // Phân quyền cũ (giữ lại để tương thích)
    mapping(address => bool) public isGarage; // can anchor service records
    mapping(address => bool) public isManufacturer; // can resolve claims

    event RoleUpdated(address indexed account, string role, bool enabled);
    event AdminUpdated(address indexed account, bool enabled);
    event UserUpdated(address indexed account, bool enabled);

    // Hàm quản lý Admin
    function setAdmin(address account, bool enabled) external onlyOwner {
        isAdmin[account] = enabled;
        emit AdminUpdated(account, enabled);
    }

    // Hàm quản lý User
    function setUser(address account, bool enabled) external onlyAdmin {
        isUser[account] = enabled;
        emit UserUpdated(account, enabled);
    }

    function setGarage(address account, bool enabled) external onlyOwner {
        isGarage[account] = enabled;
        emit RoleUpdated(account, "GARAGE", enabled);
    }

    function setManufacturer(address account, bool enabled) external onlyOwner {
        isManufacturer[account] = enabled;
        emit RoleUpdated(account, "MANUFACTURER", enabled);
    }

    // Struct cho Vehicle
    struct Vehicle {
        bytes32 vehicleId; // hash của plate hoặc VIN
        address owner; // người sở hữu
        bytes32 contentHash; // hash của thông tin xe
        bool registered;
        uint256 registeredAt;
    }

    // Struct cho Maintenance Registration (Đăng ký bảo trì)
    struct MaintenanceRegistration {
        bytes32 vehicleId;
        bytes32 contentHash; // hash của thông tin bảo trì
        address requester; // người yêu cầu
        bool approved; // đã được admin xác nhận chưa
        bool processed; // đã được xử lý chưa
        address approver; // admin đã xác nhận
        uint256 requestedAt;
        uint256 approvedAt;
    }

    struct Claim {
        bytes32 vehicleId; // e.g., keccak256 of plate or VIN
        bytes32 contentHash; // off-chain claim payload hash
        address requester;
        bool resolved;
        bool approved;
        bytes32 resolutionHash; // hash of resolution document
    }

    // Mappings cho Vehicle
    mapping(bytes32 => Vehicle) public vehicles;
    mapping(address => bytes32[]) public userVehicles; // danh sách xe của user

    // Mappings cho Maintenance Registration
    uint256 public nextMaintenanceRegId = 1;
    mapping(uint256 => MaintenanceRegistration) public maintenanceRegistrations;
    mapping(bytes32 => uint256[]) public vehicleMaintenanceRegs; // danh sách đăng ký bảo trì của xe

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

    // Events cho Vehicle
    event VehicleRegistered(
        bytes32 indexed vehicleId,
        address indexed owner,
        bytes32 contentHash,
        uint256 timestamp
    );

    // Events cho Maintenance Registration
    event MaintenanceRegistrationCreated(
        uint256 indexed regId,
        bytes32 indexed vehicleId,
        bytes32 contentHash,
        address indexed requester,
        uint256 timestamp
    );

    event MaintenanceRegistrationApproved(
        uint256 indexed regId,
        bytes32 indexed vehicleId,
        address indexed approver,
        uint256 timestamp
    );

    function anchorServiceRecord(bytes32 vehicleId, bytes32 contentHash) external {
        require(isGarage[msg.sender] || isAdmin[msg.sender], "not garage or admin");
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

    // ============ FUNCTIONS FOR USER ============

    /**
     * @dev User đăng ký xe mới
     * @param vehicleId hash của biển số hoặc VIN
     * @param contentHash hash của thông tin xe
     */
    function registerVehicle(bytes32 vehicleId, bytes32 contentHash) external {
        require(isUser[msg.sender], "not user");
        require(!vehicles[vehicleId].registered, "vehicle already registered");
        
        vehicles[vehicleId] = Vehicle({
            vehicleId: vehicleId,
            owner: msg.sender,
            contentHash: contentHash,
            registered: true,
            registeredAt: block.timestamp
        });
        
        userVehicles[msg.sender].push(vehicleId);
        emit VehicleRegistered(vehicleId, msg.sender, contentHash, block.timestamp);
    }

    /**
     * @dev User tạo lệnh đăng ký bảo trì
     * @param vehicleId hash của xe cần bảo trì
     * @param contentHash hash của thông tin bảo trì
     * @return regId ID của lệnh đăng ký
     */
    function createMaintenanceRegistration(bytes32 vehicleId, bytes32 contentHash) external returns (uint256 regId) {
        require(isUser[msg.sender], "not user");
        require(vehicles[vehicleId].registered, "vehicle not registered");
        require(vehicles[vehicleId].owner == msg.sender, "not vehicle owner");
        
        regId = nextMaintenanceRegId++;
        maintenanceRegistrations[regId] = MaintenanceRegistration({
            vehicleId: vehicleId,
            contentHash: contentHash,
            requester: msg.sender,
            approved: false,
            processed: false,
            approver: address(0),
            requestedAt: block.timestamp,
            approvedAt: 0
        });
        
        vehicleMaintenanceRegs[vehicleId].push(regId);
        emit MaintenanceRegistrationCreated(regId, vehicleId, contentHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Lấy danh sách xe của user
     * @param userAddress địa chỉ của user
     * @return vehicleIds mảng các vehicleId
     */
    function getUserVehicles(address userAddress) external view returns (bytes32[] memory) {
        return userVehicles[userAddress];
    }

    /**
     * @dev Lấy danh sách đăng ký bảo trì của xe
     * @param vehicleId hash của xe
     * @return regIds mảng các registration IDs
     */
    function getVehicleMaintenanceRegs(bytes32 vehicleId) external view returns (uint256[] memory) {
        return vehicleMaintenanceRegs[vehicleId];
    }

    // ============ FUNCTIONS FOR ADMIN ============

    /**
     * @dev Admin xác nhận lệnh đăng ký bảo trì
     * @param regId ID của lệnh đăng ký
     */
    function approveMaintenanceRegistration(uint256 regId) external onlyAdmin {
        MaintenanceRegistration storage reg = maintenanceRegistrations[regId];
        require(!reg.processed, "registration already processed");
        
        reg.approved = true;
        reg.processed = true;
        reg.approver = msg.sender;
        reg.approvedAt = block.timestamp;
        
        emit MaintenanceRegistrationApproved(regId, reg.vehicleId, msg.sender, block.timestamp);
    }

    /**
     * @dev Admin từ chối lệnh đăng ký bảo trì
     * @param regId ID của lệnh đăng ký
     */
    function rejectMaintenanceRegistration(uint256 regId) external onlyAdmin {
        MaintenanceRegistration storage reg = maintenanceRegistrations[regId];
        require(!reg.processed, "registration already processed");
        
        reg.approved = false;
        reg.processed = true;
        reg.approver = msg.sender;
        reg.approvedAt = block.timestamp;
        
        emit MaintenanceRegistrationApproved(regId, reg.vehicleId, msg.sender, block.timestamp);
    }

    /**
     * @dev Lấy thông tin lệnh đăng ký bảo trì
     * @param regId ID của lệnh đăng ký
     * @return registration thông tin đăng ký
     */
    function getMaintenanceRegistration(uint256 regId) external view returns (MaintenanceRegistration memory) {
        return maintenanceRegistrations[regId];
    }

    /**
     * @dev Lấy tất cả các lệnh đăng ký bảo trì chờ xác nhận
     * @param startId ID bắt đầu
     * @param count số lượng muốn lấy
     * @return pendingRegs mảng các registration IDs đang chờ
     */
    function getPendingMaintenanceRegistrations(uint256 startId, uint256 count) external view returns (uint256[] memory) {
        uint256[] memory pending = new uint256[](count);
        uint256 found = 0;
        uint256 currentId = startId;
        
        while (found < count && currentId < nextMaintenanceRegId) {
            if (!maintenanceRegistrations[currentId].processed) {
                pending[found] = currentId;
                found++;
            }
            currentId++;
        }
        
        // Resize array to actual found count
        uint256[] memory result = new uint256[](found);
        for (uint256 i = 0; i < found; i++) {
            result[i] = pending[i];
        }
        return result;
    }
}


