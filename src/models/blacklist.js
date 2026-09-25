const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "token is required to blacklist"],
        unique : [true, "token is already blacklisted"]
    }
}, { timestamps : true })

tokenBlacklistSchema.index({ createdAt : 1 }, { 
    expireAfterSeconds : 60 * 60 * 24 * 7 
}); // Expire after 7 days

const blacklistModel = mongoose.model("Blacklist", tokenBlacklistSchema);



module.exports = blacklistModel;