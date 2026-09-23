const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : true
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : true
    },
    status : {
        type : String,
        enum : ["PENDING", "COMPLETED", "FAILED"],
        default : "PENDING"
    },
    amount : {
        type : Number,
        required : true
    },
    idempotencyKey : {
        type : String,
        required : true,
        index : true,
        unique : true
    }
}, { timestamps : true });


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;