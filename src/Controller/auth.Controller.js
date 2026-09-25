
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const emailService = require("../utils/email.service.js");
const Blacklist = require("../models/blacklist.js");


const userRegister = async (req, res) => {
    try {
        const {email, name, password} = req.body;
        const isUser = await User.findOne({email : email});
        if(isUser){
            return res.status(422).json({
                success : false,
                message : "User already exist with this email"
            })
        }
        const user = new User({
            email,
            name,
            password
        });
        await user.save();
        const token = jwt.sign({id : user._id}, 
            process.env.JWT_SECRET, 
            {expiresIn : "1d"});

        await emailService.sendResgitrationEmail(user.email, user.name);

        return res.status(201).json({
            success : true,
            message : "User registered successfully",
            user,
            token 
        });

    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Error registering user",
            error : err.message
        })
    }
}


// POST /api/auth/login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Create session using HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error logging in user",
            error: err.message
        });
    }
};

const userLogout = async (req, res) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided"
            });
        }

        // Add the token to the blacklist
        res.cookie("token", "", { maxAge: 0, httpOnly: true });
        await Blacklist.create({ token });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
        


    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Error logging out user",
            error : err.message
        });
    }
}



module.exports = {
    userRegister,
    userLogin,
    userLogout
}
