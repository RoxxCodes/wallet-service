const config = require("../../config/config.json");
const { Sequelize } = require("sequelize");
const {DB_HOST, DB_NAME, DB_PASSWORD, DB_USER} = require("../constant/constants");
const logger = require("../utils/logger");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password, 
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info(`Connected to ${env} database: ${dbConfig.database}`);
    } catch (error) {
        logger.error("Database connection error:", error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
