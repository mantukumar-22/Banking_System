const mongoose = require("mongoose");

const connected = async() => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Server is connected to DB");
    })
    .catch(err => {
        console.log("Error connecting DB", err);
    })

}

module.exports = connected