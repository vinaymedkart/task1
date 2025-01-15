import {Tag} from '../models/index.js';
import {Product} from '../models/index.js';

export const createTag = async (req, res) => {
    const { name, isActive } = req.body;

    try {
        
        // Check if the tag already exists
        const existingTag = await Tag.findOne({ where: { name } });
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists' });
        }

        // Create new tag
        const tag = await Tag.create({ name, isActive });

        return res.status(201).json({ message: 'Tag created successfully', tag});
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getAllTags = async (req, res) => {
    try {
       
        const tags = await Tag.findAll();
        
        if (tags.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }

        return res.status(200).json(tags);
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
