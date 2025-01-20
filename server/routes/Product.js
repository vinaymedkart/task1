import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    createProduct,
    getAllProducts,updateProduct,deleteProduct,
    viewDetails
} from "../controllers/Product.js"


router.post("/create",auth, createProduct)
router.post("/getAll",auth,getAllProducts )
router.put("/edit",auth, updateProduct)
router.put("/delete",auth, deleteProduct)
router.get("/viewDetails/:id",auth, viewDetails)




export default router