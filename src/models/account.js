const mongoose = require("mongoose");
const ledgerModel = require("./ledger");

const accountSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    status : {
        type : String,
        enum :{
            values : ["ACTIVE", "INACTIVE", "CLOSED"],
        },
        default : "ACTIVE"
    },
    currency : {
        type : String,
        required : true,
        default : "INR"    
    }
}, {timestamps : true});

accountSchema.index({user : 1, status : 1});

// accountSchema.methods.getBalance = async function () {
//     const balanceDate = await ledgerModel.aggregate([
//         { $match : { account : this_id }},
//         {
//             $group : {
//                 _id : null,
//                 totalDebit : {
//                     $sum : {
//                         $cond : [
//                             {$eq : ['$type', 'DEBIT']},
//                             '$amount',
//                             0
//                         ]
//                     }
//                 },

//                 totalCredit : {
//                     $sum : {
//                         $cond : [
//                             {$eq : ['$type', 'CREDIT']},
//                             '$amount',
//                             0
//                         ]
//                     }
//                 }
//             }
//         },
//         {
//             $project : {
//                 _id : 0,
//                 balance : {
//                     $subtract : [ '$totalCredit', '$totalDebit']
//                 }
//             }
//         }
//     ])

//     if(balanceDate.length === 0){
//         return 0;
//     }

//     return balanceDate[0].getbalance;
// }


accountSchema.methods.getBalance = async function () {

    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
    ])

    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[ 0 ].balance

}




const accountModel = mongoose.model("Account", accountSchema);



module.exports = accountModel;
