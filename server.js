

const app = require("./src/app.js");
require('dotenv').config();

const connectDB = require("./src/config/db.js");

connectDB();

const port = process.env.PORT;


app.get("/", (req, res) => {
    res.send("Welcome to the BankSystem API");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})