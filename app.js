require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Database Connection
const dbConnection = require("./db/Connection");
dbConnection();

// Routes
app.use("/", require("./routes/test"));
app.use("/api/v1/youtube", require("./routes/youtube"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/auth", require("./routes/auth"));


// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is started... http://localhost:${PORT}`);
});
