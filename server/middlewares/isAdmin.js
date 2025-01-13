import dotenv from "dotenv";
dotenv.config();

export const isAdmin = (req, res, next) => {
    const parameter = req.params.id;

    if (parameter === process.env.ADMIN_ACCESS) {
        next(); // If the parameter matches, proceed to the next middleware or route handler
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. Admin validation failed.",
        });
    }
};
