const mongoose = require('mongoose');


const ledgerSchema = new mongoose.Schema ({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : true
    },
    accountBlance : {
        type : Number,
        required : true,
        default : 0
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transaction",
        required : true
    },
    type :{
        type : String,
        enum : ["DEBIT", "CREDIT"],
        required : true,
        immutable : true
    }
}, { timestamps : true });

function updateAccountBalance() {
    // Implementation for updating account balance
    throw new Error("Not implemented yet");
}

ledgerSchema.pre('findOneAndUpdate', updateAccountBalance);
ledgerSchema.pre('updateOne', updateAccountBalance);
ledgerSchema.pre('deleteOne', updateAccountBalance);
ledgerSchema.pre('remove', updateAccountBalance);
ledgerSchema.pre('deletMany', updateAccountBalance);
ledgerSchema.pre('updateMany', updateAccountBalance);
ledgerSchema.pre('findOneAndReplace', updateAccountBalance);
ledgerSchema.pre('findOneAndDelete', updateAccountBalance);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;