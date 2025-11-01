//// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract CarTransactionHistory {
    // Owner of the contract: authorized for adding/removing car information
    address public owner;

    struct Transaction {
        string carId; // ID of the car: 17-character VIN number
        string dateTransaction; // Date of car purchase
        string buyerId; // ID of the buyer
        string sellerId; // ID of the seller
        string price; // Price of the car at the time of sale
        string signatureBuyer; // Buyer's digital signature
        string signatureSeller; // Seller's digital signature
    }

    /*  
    Mapping to store car transaction history
    */
    mapping(string => Transaction[]) transactionHistory;

    uint public transactionCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Event emitted when information is successfully updated
    event NewUpdate(address indexed from, uint256 timestamp, string message);

    function addTransaction(
        string memory _carId,
        string memory _dateTransaction,
        string memory _buyerId,
        string memory _sellerId,
        string memory _price,
        string memory _signatureBuyer,
        string memory _signatureSeller
    ) public onlyOwner {
        transactionCount++;
        Transaction memory newTransaction = Transaction({
            carId: _carId,
            dateTransaction: _dateTransaction,
            buyerId: _buyerId,
            sellerId: _sellerId,
            price: _price,
            signatureBuyer: _signatureBuyer,
            signatureSeller: _signatureSeller
        });
        transactionHistory[_carId].push(newTransaction);
        emit NewUpdate(msg.sender, block.timestamp, "Successful update!");
    }

    //get all transaction array by carID
    function getTransactionsByCarID(
        string memory carId
    ) public view returns (Transaction[] memory) {
        require(
            transactionHistory[carId].length != 0,
            " Oops! we dont't have car ID "
        );
        return transactionHistory[carId];
    }
}

contract Carmaintenance {
    struct Maintenance {
        string carId; // ID of the car: 17-character VIN number
        uint16 totalKmRun; // total Km run
        string typeOfMaintain; // type of Maintain
        string placeMatintain; // place Maintain
        string result; // result
    }

    // mapping to store the Carmaintenance History

    mapping(string => Maintenance[]) maintenanceHistory;

    event NewUpdate(address indexed from, uint256 timestamp, string message);

    function addMaintenance(
        string memory _carId,
        uint16 _totalKmRun,
        string memory _typeOfMaintain,
        string memory _placeMaintain,
        string memory _result
    ) public {
        Maintenance memory newMaintenance = Maintenance(
            _carId,
            _totalKmRun,
            _typeOfMaintain,
            _placeMaintain,
            _result
        );
        maintenanceHistory[_carId].push(newMaintenance);
        emit NewUpdate(msg.sender, block.timestamp, "Successful update!");
    }

    function getMaintenanceHistoryByCarId(
        string memory _carId
    ) public view returns (Maintenance[] memory) {
        require(
            maintenanceHistory[_carId].length != 0,
            " Oops! we dont't have car ID "
        );
        return maintenanceHistory[_carId];
    }
}

contract Caraccident {
    struct Accident {
        string carId; // ID of the car: 17-character VIN number
        // string picture : upadte soon...
        string decribeAccident; // type of accident
        string decribeFix; // decribe the problem : what position need the change
        string result; // decribe what components need repair
    }

    mapping(string => Accident[]) accidentFixHistory;
    event NewUpdate(address indexed from, uint256 timestamp, string message);

    function addAccidentFix(
        string memory _carId,
        string memory _describeAccident,
        string memory _describeFix,
        string memory _result
    ) public {
        Accident memory newAccidentFix = Accident(
            _carId,
            _describeAccident,
            _describeFix,
            _result
        );
        //check carId before storage
        accidentFixHistory[_carId].push(newAccidentFix);
        emit NewUpdate(msg.sender, block.timestamp, "Successful update!");
    }

    function getAccidentFixHistoryByCarId(
        string memory _carId
    ) public view returns (Accident[] memory) {
        require(
            accidentFixHistory[_carId].length != 0,
            " Oops! we dont't have car ID "
        );
        return accidentFixHistory[_carId];
    }
}
