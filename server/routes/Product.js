import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    createProduct,
    getAllProducts,updateProduct,deleteProduct
} from "../controllers/Product.js"


router.post("/create",auth, createProduct)
router.get("/getAll",auth,getAllProducts )
router.put("/edit",auth, updateProduct)
router.put("/delete",auth, deleteProduct)



export default router