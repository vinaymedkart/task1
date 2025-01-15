import express from 'express'
const router = express.Router()
import dotenv from "dotenv"; dotenv.config();
import {auth} from '../middlewares/auth.js' 
import {
createCategory,
getAllCategorys  
} from "../controllers/Category.js"


router.post("/create",auth, createCategory)
router.get("/getAll",auth, getAllCategorys)

export default router