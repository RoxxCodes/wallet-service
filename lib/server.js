const config = require("config");
const express = require("express");
const { connectDB, sequelize } = require("./config/db");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");
const helmet = require("helmet");
const { BASE_PATH, TRANSACTION, WALLET } = require("./constant/constants");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(`${BASE_PATH}/${WALLET}`, walletRoutes);
app.use(`${BASE_PATH}/${TRANSACTION}`, transactionRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});



function startApp(port) {
    try { 
        app.listen(port, async () => {
            await connectDB();
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

startApp(config.get("server.port"));

app.use((err, req, res, next) => {
    console.error("🔥 Internal Server Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});
