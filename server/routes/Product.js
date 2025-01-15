import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    createProduct,
    getAllProducts
} from "../controllers/Product.js"

// const { auth } = require("../middlewares/auth")

router.post("/:id/create",auth, createProduct)
router.get("/getAll",getAllProducts )


export default router