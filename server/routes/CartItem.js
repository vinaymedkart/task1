import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    addCartItem
} from "../controllers/CartItem.js"


router.post('/add',auth,addCartItem)

export default router