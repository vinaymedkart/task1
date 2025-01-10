import express from "express"
import { addEmp, getAllEmp } from "../controller/userController.js";
const router = express.Router();

router.get('/getAll',getAllEmp)
router.post('/addEmp',addEmp)
    

export default router