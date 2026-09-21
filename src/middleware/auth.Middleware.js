
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log("AUTH ERROR:", err.message);

        return res.status(401).json({
            success: false,
            message: "Error in auth middleware",
            error: err.message
        });
    }
};

const systemUserMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.hearders.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Invalid token, authorization denied"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                success : false,
                message : "Access denied, only system user can access this route"
            })
        }

        req.user = user;
        next();
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Error in system user middleware"
        })
    }
}

module.exports = {
    authMiddleware,
    systemUserMiddleware
}