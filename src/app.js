const express = require("express");
const cookieParsser = require("cookie-parser")


const authRouter = require("./routes/auth.Routes.js")
const accountRouter = require("./routes/account.Routes.js")
const transectionRouter = require("./routes/transection.Routes.js")


const app = express();


app.use(express.json());
app.use(cookieParsser());

app.get("/", (req, res) => {
    res.send("Welcome to the Bank System API");
});

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transectionRouter)



module.exports = app