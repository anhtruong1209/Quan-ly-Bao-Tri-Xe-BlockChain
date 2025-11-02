// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract RealEstateRegistry {
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

    // Phân quyền: Admin và User
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isUser;

    // Phân quyền cho Notary (Công chứng viên) và Broker (Môi giới)
    mapping(address => bool) public isNotary;
    mapping(address => bool) public isBroker;

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

    function setNotary(address account, bool enabled) external onlyOwner {
        isNotary[account] = enabled;
        emit RoleUpdated(account, "NOTARY", enabled);
    }

    function setBroker(address account, bool enabled) external onlyOwner {
        isBroker[account] = enabled;
        emit RoleUpdated(account, "BROKER", enabled);
    }

    // Struct cho Real Estate (Bất động sản)
    struct RealEstate {
        bytes32 propertyId; // hash của mã tài sản hoặc địa chỉ
        address owner; // chủ sở hữu hiện tại
        bytes32 contentHash; // hash của thông tin bất động sản
        bool registered;
        uint256 registeredAt;
    }

    // Struct cho Transaction (Giao dịch)
    struct Transaction {
        bytes32 propertyId;
        bytes32 contentHash; // hash của thông tin giao dịch
        address requester; // người yêu cầu
        bool approved; // đã được admin/notary xác nhận chưa
        bool processed; // đã được xử lý chưa
        address approver; // admin/notary đã xác nhận
        uint256 requestedAt;
        uint256 approvedAt;
    }

    // Mappings cho Real Estate
    mapping(bytes32 => RealEstate) public properties;
    mapping(address => bytes32[]) public userProperties; // danh sách BĐS của user

    // Mappings cho Transaction
    uint256 public nextTransactionId = 1;
    mapping(uint256 => Transaction) public transactions;
    mapping(bytes32 => uint256[]) public propertyTransactions; // danh sách giao dịch của BĐS

    event PropertyRegistered(
        bytes32 indexed propertyId,
        address indexed owner,
        bytes32 contentHash,
        uint256 timestamp
    );

    event TransactionCreated(
        uint256 indexed transactionId,
        bytes32 indexed propertyId,
        bytes32 contentHash,
        address indexed requester,
        uint256 timestamp
    );

    event TransactionApproved(
        uint256 indexed transactionId,
        bytes32 indexed propertyId,
        address indexed approver,
        uint256 timestamp
    );

    event TransactionRejected(
        uint256 indexed transactionId,
        bytes32 indexed propertyId,
        address indexed approver,
        uint256 timestamp
    );

    event TransactionAnchored(
        bytes32 indexed propertyId,
        bytes32 indexed contentHash,
        address indexed notary,
        uint256 timestamp
    );

    // Đăng ký bất động sản
    function registerProperty(bytes32 propertyId, bytes32 contentHash) external {
        require(isUser[msg.sender], "not user");
        require(!properties[propertyId].registered, "property already registered");

        properties[propertyId] = RealEstate({
            propertyId: propertyId,
            owner: msg.sender,
            contentHash: contentHash,
            registered: true,
            registeredAt: block.timestamp
        });

        userProperties[msg.sender].push(propertyId);
        emit PropertyRegistered(propertyId, msg.sender, contentHash, block.timestamp);
    }

    // Tạo giao dịch mới
    function createTransaction(bytes32 propertyId, bytes32 contentHash) external returns (uint256 id) {
        require(isUser[msg.sender], "not user");
        require(properties[propertyId].registered, "property not registered");

        id = nextTransactionId++;
        transactions[id] = Transaction({
            propertyId: propertyId,
            contentHash: contentHash,
            requester: msg.sender,
            approved: false,
            processed: false,
            approver: address(0),
            requestedAt: block.timestamp,
            approvedAt: 0
        });

        propertyTransactions[propertyId].push(id);
        emit TransactionCreated(id, propertyId, contentHash, msg.sender, block.timestamp);
        return id;
    }

    // Admin hoặc Notary duyệt giao dịch
    function approveTransaction(uint256 transactionId) external {
        require(isAdmin[msg.sender] || isNotary[msg.sender], "not admin or notary");
        require(!transactions[transactionId].processed, "transaction already processed");

        Transaction storage transaction = transactions[transactionId];
        transaction.approved = true;
        transaction.processed = true;
        transaction.approver = msg.sender;
        transaction.approvedAt = block.timestamp;

        emit TransactionApproved(transactionId, transaction.propertyId, msg.sender, block.timestamp);
    }

    // Admin hoặc Notary từ chối giao dịch
    function rejectTransaction(uint256 transactionId) external {
        require(isAdmin[msg.sender] || isNotary[msg.sender], "not admin or notary");
        require(!transactions[transactionId].processed, "transaction already processed");

        Transaction storage transaction = transactions[transactionId];
        transaction.approved = false;
        transaction.processed = true;
        transaction.approver = msg.sender;
        transaction.approvedAt = block.timestamp;

        emit TransactionRejected(transactionId, transaction.propertyId, msg.sender, block.timestamp);
    }

    // Notary hoặc Admin xác thực giao dịch lên blockchain
    function anchorTransaction(bytes32 propertyId, bytes32 contentHash) external {
        require(isNotary[msg.sender] || isAdmin[msg.sender], "not notary or admin");
        emit TransactionAnchored(propertyId, contentHash, msg.sender, block.timestamp);
    }
}

