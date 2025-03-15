const config = require("config");
const express = require("express");
const { connectDB, sequelize } = require("./config/db");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");
const helmet = require("helmet");
const { BASE_PATH, TRANSACTION, WALLET } = require("./constant/constants");
const { Umzug, SequelizeStorage } = require("umzug");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(`${BASE_PATH}/${WALLET}`, walletRoutes); // Wallet endpoints
app.use(`${BASE_PATH}/${TRANSACTION}`, transactionRoutes); // Transactions endpoints

app.get("/", (req, res) => {
    res.send("API is running...");
});


const umzug = new Umzug({
    migrations: {
        glob: "migrations/*.js",
        resolve: ({ name, path, context }) => {
            const migration = require(path); // ✅ Load migration file
            return {
                name,
                up: async () => migration.up(context, sequelize.Sequelize), // ✅ Pass Sequelize correctly
                down: async () => migration.down(context, sequelize.Sequelize) // ✅ Pass Sequelize correctly
            };
        }
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console, // ✅ Logs migration execution
});

const runMigrations = async () => {
    try {
        console.log("Checking and applying pending migrations...");
        await umzug.up();
        console.log("Migrations applied successfully.");
    } catch (error) {
        console.error("Migration error:", error);
        throw error;
    }
};


// Start Server
function startApp(port) {
    try { 
        app.listen(port, async () => {
            await connectDB();
            await runMigrations();
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
