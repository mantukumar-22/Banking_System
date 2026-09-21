
const transactionModel = require('../models/transaction.js')
const ledgerModel = require('../models/ledger.js')
const accountModel = require('../models/account.js')   
const emailService = require('../utils/email.service.js');
const mongoose = require('mongoose');


const createTransetion = async (req, res) => {
    try{

        // Validate request body
        const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

        if(!fromAccount || !toAccount || !amount || !idempotencyKey){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const fromUserAccount = await accountModel.findOne({
            _id : fromAccount
        });
         
        const toUserAccount = await accountModel.findOne({
            _id : toAccount
        }); 
        
        if(!fromUserAccount || !toUserAccount){
            return res.status(404).json({
                success : false,
                message : "Invailed fromAcount to ttAcount"
            })
        }

        // Check if idempotency key already exists
        const isTransetionExist = await transectionModel.findOne({idempotencyKey});
        if(isTransetionExist){
            if(isTransetionExist.status === "completed"){
                return res.status(200).json({
                    success : true,
                    message : "Transetion has completed",
                    transetion : isTransetionExist
                })
            }

            if(isTransetionExist.status === "pending"){
                return res.status(200).json({
                    success : true,
                    message : "Transetion is pending",
                    transetion : isTransetionExist
                })
            }

            if(isTransetionExist.status === "failed"){
                return res.status(500).json({
                    success : true,
                    message : "Transetion processing failed",
                    transetion : isTransetionExist
                })
            }

            if(isTransetionExist.status === "reversed"){
                return res.status(500).json({
                    success : true, 
                    message : "Transetion was reversed",
                    transetion : isTransetionExist
                })
            }
        }

        // check if from account status is active
        if(fromUserAccount.status !== "active" || toUserAccount.status !== "active"){
            return res.status(400).json({
                success : false,
                message : "One or both accounts are not active"
            })
        }

        const balance = await fromUserAccount.getBalance();

        if(balance < amount) {
            return res.status(400).json({
                message : `Insufficent balance. Current balance is ${balance}. Requested amonut is ${amount}`
            })
        }

        // create transaction (pending)

        const session = await mongoose.startSession();
        session.startTransaction();

        const transaction = await transectionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status : "pending"
        }, {session}); 

        const debitLedger = await ledgerModel.create({
            account : fromAccount,
            type : "DEBIT",
            amount : amount,
            transaction : transaction._id
        }, {session});

        const creditLedger = await ledgerModel.create({
            account : toAccount,
            type : "CREDIT",
            amount : amount,
            transaction : transaction._id
        }, {session});

        transaction.status = "completed";
        await transaction.save({session});

        await session.commitTransaction();
        session.endSession();

        // send email to both users
        await emailService.sendTransactionEmail(fromUserAccount.user.email, fromUserAccount.user.name, amount, toUserAccount._id);

        return res.status(200).json({
            success : true,
            message : "Transetion completed successfully",
            transetion : transaction
        })
        
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : err
        })
    }
}


// const createInitalTransetion = async (req, res) => {
//     let session;

//     try {
//         const { toAccount, amount, idempotencyKey } = req.body;

//         if (!toAccount || !amount || !idempotencyKey) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // Check amount
//         if (amount <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Amount must be greater than 0"
//             });
//         }

//         // Find receiver account
//         const toUserAccount = await accountModel.findById(toAccount);

//         if (!toUserAccount) {
//             return res.status(404).json({
//                 success: false,
//                 message: "To account not found"
//             });
//         }

//         // Find sender account
//         const fromUserAccount = await accountModel.findOne({
//             user: req.user._id
//         });

//         if (!fromUserAccount) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Sender account not found"
//             });
//         }

//         // Prevent sending to same account
//         if (fromUserAccount._id.toString() === toAccount.toString()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Cannot transfer money to the same account"
//             });
//         }

//         // Start session
//         session = await mongoose.startSession();

//         session.startTransaction();

//         // Create transaction
//         const transaction = await transectionModel.create(
//             [
//                 {
//                     fromAccount: fromUserAccount._id,
//                     toAccount: toUserAccount._id,
//                     amount,
//                     idempotencyKey,
//                     status: "pending"
//                 }
//             ],
//             { session }
//         );

//         const createdTransaction = transaction[0];

//         // Debit ledger
//         await ledgerModel.create(
//             [
//                 {
//                     account: fromUserAccount._id,
//                     type: "DEBIT",
//                     amount,
//                     transaction: createdTransaction._id
//                 }
//             ],
//             { session }
//         );

//         // Credit ledger
//         await ledgerModel.create(
//             [
//                 {
//                     account: toUserAccount._id,
//                     type: "CREDIT",
//                     amount,
//                     transaction: createdTransaction._id
//                 }
//             ],
//             { session }
//         );

//         // Complete transaction
//         createdTransaction.status = "completed";

//         await createdTransaction.save({ session });

//         // Commit
//         await session.commitTransaction();
//         session.endSession();

//         return res.status(200).json({
//             success: true,
//             message: "Initial transaction completed successfully",
//             transaction: createdTransaction
//         });

//     } catch (err) {

//         console.log("TRANSACTION ERROR:", err);

//         if (session) {
//             await session.abortTransaction();
//             session.endSession();
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: err.message
//         });
//     }
// };


const createInitalTransetion = async (req, res) => {

    try {
        const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    } ], { session })

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    } ], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })

    } catch (err) {

        console.log("TRANSACTION ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });

    }
};



module.exports = {
    createTransetion,
    createInitalTransetion
}