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

const getAllAccount = async (req, res) =>{
    
}

module.exports = {
    createAccount
};