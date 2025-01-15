import express from 'express'
const router = express.Router()

import {
    getAll,
    login,
    signup
} from "../controllers/User.js"


router.post("/login", login)
router.post("/signup", signup)
router.get("/get", getAll)



export default router