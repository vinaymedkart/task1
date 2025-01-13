import express from 'express'
const router = express.Router()
import dotenv from "dotenv"; dotenv.config();
import {isAdmin} from '../middlewares/isAdmin.js' 
import {
createTag ,
getAllTags  
} from "../controllers/Tags.js"


router.post("/:id/create",isAdmin, createTag)
router.get("/:id/get",isAdmin, getAllTags)

export default router