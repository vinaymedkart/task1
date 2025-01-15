import jwt from "jsonwebtoken";
import dotenv from "dotenv";dotenv.config();

export const auth = async (req, res, next) => {
    try {
        //whatever name you give from frontend services/operations/bussiness/createBussiness that name you have to use
        console.log(req.header("Authorization"))
        const token = req.header("Authorization")?.replace("Bearer ", "");;
        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }
        try {
            req.user = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
};