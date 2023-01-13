const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const questsRoutes = require("./routes/quests");
const usersRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transaction");
const badgeRoutes = require("./routes/badge");
const shareRoutes = require("./routes/share");
const signatureRoutes = require("./routes/signature");


const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/quests", questsRoutes);
app.use("/users", usersRoutes);
app.use("/transaction", transactionRoutes);
app.use("/badge", badgeRoutes);
app.use("/share", shareRoutes);
app.use("/sign-message", signatureRoutes);


// If nothing processed the request, return 404
app.use((req, res) => {
  console.log(`Request to ${req.path} resulted in 404`);
  res.status(404).json({ error: "not found" });
});


module.exports = app; 
