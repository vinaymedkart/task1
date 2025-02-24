import express from 'express'
const router = express.Router()
import dotenv from "dotenv"; dotenv.config();
import {auth} from '../middlewares/auth.js' 
import {
createTag,
getAllTags  
} from "../controllers/Tags.js"


router.post("/create",auth, createTag)
router.get("/getAll",auth, getAllTags)

export default router