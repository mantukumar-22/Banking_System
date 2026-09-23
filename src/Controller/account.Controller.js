const accountModel = require("../models/account.js");

const createAccount = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const account = await accountModel.create({
            user: userId
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            account
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error creating account",
            error: err.message
        });
    }
};

const getAllAccount = async (req, res) => {
    try {
        const accounts = await accountModel.find({
            user : req.user._id
        })

        return res.status(200).json({
            success : true,
            accounts
        })
    }
    catch (error) {
        return res.status.json({
            success : false,
            message : "Internal server Error"
        })
    }
    
}

const getAccountBalance = async (req, res) => {
    try {
        const { accountId } = req.params;

        // Validate accountId
        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required"
            });
        }

        // Find user's account
        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        // Calculate balance
        const balance = await account.getBalance();

        return res.status(200).json({
            success: true,
            accountId: account._id,
            balance
        });

    } catch (error) {

        console.error("Get Account Balance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



module.exports = {
    createAccount,
    getAllAccount,
    getAccountBalance
};