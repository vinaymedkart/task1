import express from 'express'
const router = express.Router()
import {isAdmin} from '../middlewares/isAdmin.js' 
import {
    createProduct,
    addProductToTag,
    getAllProducts
} from "../controllers/Product.js"

// const { auth } = require("../middlewares/auth")

router.post("/:id/create",isAdmin, createProduct)
router.post("/:id/addProductToTag", isAdmin, addProductToTag)
router.get("/getAllProducts",getAllProducts )


export default router