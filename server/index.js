import express, { urlencoded } from 'express'
import {connection} from './postgres/connection.js'
import cors from 'cors';

import cookieParser from "cookie-parser";
import dotenv from "dotenv";dotenv.config();

import customerRoutes from "./routes/Customer.js";
import adminRoutes from './routes/Admin.js';
import productRoutes from './routes/Product.js';
import tagRoutes from './routes/Tags.js';


const app = express();
const PORT=8000

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*", // Allow all origins then only vercel error will be resolved
    })
);

app.use("/api/v1/auth", customerRoutes);
app.use("/api/v1/authadmin", adminRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/tag", tagRoutes);


app.listen(PORT,()=>{
    console.log(`Server running at PORT ${PORT}`)
})

connection()