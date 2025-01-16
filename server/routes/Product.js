import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    createProduct,
    getAllProducts
} from "../controllers/Product.js"


router.post("/create",auth, createProduct)
router.get("/getAllProducts",getAllProducts )


export default router