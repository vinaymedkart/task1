import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// import Category from '../models/Category.js'; // Adjusted the relative path
// import Product from '../models/Product.js';  // Adjusted the relative path

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'Shiv@00000',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Disable logging for cleaner console output
    }
);

// Export the instance for use in other parts of the application
export default sequelize;


export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        // Synchronize all models at once
        await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Failed to connect or synchronize the database:", error);
        process.exit(1);
    }
};
