import express from 'express'
const router = express.Router()
import {auth} from '../middlewares/auth.js' 
import {
    addProduct,editProduct,getAllProducts
} from "../controllers/Inventory.js"


router.post("/add",auth, addProduct)
router.put("/edit",auth,editProduct)
router.get("/getAll",auth,getAllProducts)


export default router