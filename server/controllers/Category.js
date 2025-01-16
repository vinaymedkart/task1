
import {Category} from '../models/index.js';
export const createCategory= async (req, res) => {
    const { name, isActive } = req.body;

    try {
        
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, isActive });

        return res.status(201).json({success:true, message: 'Category created successfully', category});
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getAllCategorys = async (req, res) => {
    try {
       
        const categorys = await Category.findAll();
        
        if (categorys.length === 0) {
            return res.status(404).json({success:true, message: 'No categorys found' });
        }

        return res.status(200).json({success:true,categorys});
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
