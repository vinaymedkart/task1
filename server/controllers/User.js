
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"; dotenv.config();

import User  from "../models/User.js";
import Cart from "../models/Cart.js";
import Tag from "../models/Tags.js";
import Category from "../models/Category.js";


export const signup = async(req,res)=>{
    try{
		
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
			role
			
        } = req.body
		// console.log(req.body)
        if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!role
			
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
    
        if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

        const existingUser = await User.findOne({
			where: { email }
		});
		
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Email already exists. Please login in to continue.",
			});
		}
        const hashedPassword = await bcrypt.hash(password, 10);
		const data = {
			firstName,
			lastName,
			email,
		}
        const user = await User.create({
			...data,
			password: hashedPassword,
			role
		});

		await Cart.create({
            UserMail: user.email
        });


		return res.status(200).json({
			success: true,
			data,
			message: "Successfully registered ",
		});

    } catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success: false,
			message: "Email cannot be registered. Please try again.",
        })
    }
}

export const login = async (req, res) => { 
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}
		
		const user = await User.findOne({
			where: { email }
		});
		

		if (!user)
		{
			return res.status(401).json({
				success: false,
				message: `User is not Registered with us. Please SignUp to Continue`,
			});
		}
		
		if (await bcrypt.compare(password, user.password)) {
			const data={email: user.email,role: user.role};

			const verifyData = await bcrypt.hash(JSON.stringify(data), 10);
			const token = jwt.sign(
				{ email: user.email, id: user._id},
				process.env.JWT_SECRET,
				{	
					expiresIn: "1h",
				}
			);

			user.token = token;
			user.password = undefined;
			
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			const tags = await Tag.findAll({
				order: [['name', 'ASC']]    
			});
	
			if (tags.length === 0) {
				return res.status(404).json({ success: true, message: 'No tags found' });
			}
			const categorys = await Category.findAll({
				order: [['name', 'ASC']]
			});
			
			if (categorys.length === 0) {
				return res.status(404).json({ success: true, message: 'No categories found' });
			}
	
			
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				verifyData,
				message: `User Login Success`,
				tags,
				categorys
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};



export const getAll = async (req, res) => { 
	try {
		
		const users = await User.findAll();
		
		return res.status(200).json({
			success: true,
			users, // Return the users in the response
			message: "All Users retrieved successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to get all users",
		});
	}
};
