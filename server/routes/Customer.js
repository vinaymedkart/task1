import express from 'express'
const router = express.Router()

import {
    getAll,
    login,
    signup
} from "../controllers/Customer.js"

// const { auth } = require("../middlewares/auth")

router.post("/login", login)
router.post("/signup", signup)
router.get("/get", getAll)



export default router