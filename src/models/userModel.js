const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email is require for creating a user"],
        trim : true,
        unique : true
    },
    name : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    systemUser : {
        type : Boolean,
        default : false,
        immutable : true,
        select : false
    }
}, {timestamps : true});


userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return next();
    }
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;

})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model("User", userSchema);