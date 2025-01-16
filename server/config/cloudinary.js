import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConnect = () => {
    try {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log("Cloudinary connected successfully.");
    } catch (error) {
        console.error("Cloudinary connection error: ", error);
    }
};
