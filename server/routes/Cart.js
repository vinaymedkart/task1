import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    createCart
} from "../controllers/Cart.js"

// const { auth } = require("../middlewares/auth")

router.post('/create',createCart)

export default router