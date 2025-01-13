import express from 'express'
const router = express.Router()
import dotenv from "dotenv"; dotenv.config();

import {
    getAll,
    login,
    signup
} from "../controllers/Admin.js"
import { isAdmin } from '../middlewares/isAdmin.js';

// const { auth } = require("../middlewares/auth")

router.post("/:id/Signup", isAdmin,signup)
router.post("/:id/Login", isAdmin,login)
router.get("/:id/Get", isAdmin,getAll)

export default router