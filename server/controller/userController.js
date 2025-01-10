import { UserModel  } from "../postgres/postgres.js"

export const getAllEmp = async (req,res) =>{
    try{
        const users=await UserModel.findAll();
        if(users.length==0){
            return res.status(200).json({"error":"users not found"})
        }
        return res.status(200).json(users)
    }
    catch(error){
        console.log(error)
         return res.status(200).json({"error":"Internal server error"})
    }
} 


export const addEmp = async (req,res) =>{
    const {name,email,designation,empId} = req.body
    try{
        const emp=await UserModel.findOne({where:{empId:empId}});
        if(emp==null){
            await UserModel.create(req.body)

            return res.status(201).json({message:"emp added successfully"})
        }
        return res.status(200).json({message:"already found"})
    }
    catch(error){
        console.log(error)
         return res.status(200).json({"error":"Internal server error"})
    }
} 