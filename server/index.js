import express from 'express'
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";dotenv.config();
import fileUpload from "express-fileupload"; 

import { cloudinaryConnect } from "./config/cloudinary.js";
import { initializeDatabase } from './postgres/sequelize.js';

import UserRoutes from "./routes/User.js";
import productRoutes from './routes/Product.js';
import tagRoutes from './routes/Tags.js';
import categoryRoutes from './routes/Category.js';
import cartRoutes from './routes/CartItem.js';

const app = express();
const PORT= process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 10 * 1024 * 1024 }, // You can adjust the file size limit
    abortOnLimit: true,
    createParentPath: true,
}));
app.use(
    cors({
        origin: "http://localhost:3000",  // Set this to your frontend's domain
        methods: "GET, POST, PUT, DELETE",
        allowedHeaders: "Content-Type, Authorization",  // Allow Authorization header
    })
);
cloudinaryConnect();
(async () => {
    await initializeDatabase(); // Ensure the database is ready before starting the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();

app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cartItem", cartRoutes);
