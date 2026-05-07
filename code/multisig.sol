// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./NewToken.sol";

contract Multisig {

    address[3] public admins;
    uint256 public txCount;
    Jotudela42Token public token;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;

        bool executed;
        uint8 confirmations;

        bool[3] hasVoted;
    }

    mapping(uint256 => Transaction) public transactions;

    constructor(address _token, address admin2, address admin3) {
        admins[0] = msg.sender;
        admins[1] = admin2;
        admins[2] = admin3;

        token = Jotudela42Token(_token);
    }

    // ======================
    // MODIFIERS
    // ======================

    modifier onlyAdmin() {
        bool isAdmin = false;
        for (uint i = 0; i < 3; i++) {
            if (admins[i] == msg.sender) {
                isAdmin = true;
            }
        }
        require(isAdmin, "Not an admin");
        _;
    }

    modifier txExists(uint256 _txId) {
        require(transactions[_txId].to != address(0), "Tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].executed, "Already executed");
        _;
    }

    modifier notVoted(uint256 _txId) {
        uint index = getAdminIndex(msg.sender);
        require(!transactions[_txId].hasVoted[index], "Already voted");
        _;
    }

    // ======================
    // INTERNAL HELPERS
    // ======================

    function getAdminIndex(address _addr) internal view returns (uint) {
        for (uint i = 0; i < 3; i++) {
            if (admins[i] == _addr) {
                return i;
            }
        }
        revert("Not admin");
    }

    // ======================
    // CREATE TRANSACTION (MINT)
    // ======================

    function proposeMint(address _to, uint256 _amount) public onlyAdmin {
        transactions[txCount] = Transaction({
            to: address(token),
            value: 0,
            data: abi.encodeWithSignature("mint(address,uint256)", _to, _amount),
            executed: false,
            confirmations: 0,
            hasVoted: [false, false, false]
        });

        txCount++;
    }

    // ======================
    // CREATE TRANSACTION (TRANSFER)
    // ======================

    function transferToken(address _to, uint256 _amount) public onlyAdmin {
        transactions[txCount] = Transaction({
            to: address(token),
            value: 0,
            data: abi.encodeWithSignature("transferToken(address,uint256)", _to, _amount),
            executed: false,
            confirmations: 0,
            hasVoted: [false, false, false]
        });

        txCount++;
    }

    // ======================
    // CREATE TRANSACTION (BURN)
    // ======================

    function burnToken(address _to, uint256 _amount) public onlyAdmin {
        transactions[txCount] = Transaction({
            to: address(token),
            value: 0,
            data: abi.encodeWithSignature("burnToken(address,uint256)", _to, _amount),
            executed: false,
            confirmations: 0,
            hasVoted: [false, false, false]
        });

        txCount++;
    }

    // ======================
    // VOTE
    // ======================

    function vote(uint256 _txId, bool approve)
        public
        onlyAdmin
        txExists(_txId)
        notExecuted(_txId)
        notVoted(_txId)
    {
        uint index = getAdminIndex(msg.sender);

        if (approve) {
            transactions[_txId].confirmations++;
        }

        transactions[_txId].hasVoted[index] = true;
    }

    // ======================
    // EXECUTE
    // ======================

    function execute(uint256 _txId)
        public
        onlyAdmin
        txExists(_txId)
        notExecuted(_txId)
    {
        Transaction storage txn = transactions[_txId];

        require(txn.confirmations >= 2, "Not enough confirmations");

        // 🔐 IMPORTANT : set avant le call
        txn.executed = true;

        (bool success, ) = txn.to.call(txn.data);
        require(success, "Tx failed");
    }
}