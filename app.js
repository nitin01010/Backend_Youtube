require("dotenv").config();
const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database Connection
const dbConnection = require("./db/Connection");
dbConnection();

// Routes
app.use("/", require("./routes/test"));

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is started... http://localhost:${PORT}`);
});
