import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../../services/middlewares/product';
import ProductModal from '../../common/ProductModal';
import CategoryModal from '../../common/CategoryModal';
import TagModal from '../../common/TagModal';
import { Edit2, Plus, Tag, Grid, Tags } from 'lucide-react';
import { createTag } from '../../../services/middlewares/tag';
import { createCategory } from '../../../services/middlewares/category';

function Feature() {
    const [openModal, setOpenModal] = useState({
        isOpen: false,
        type: null,
        mode: 'create',
        data: null
    });
    
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { tag, category } = useSelector((state) => state.appdata);

    const handleSubmit = (data) => {
        if (openModal.type === "Product") {
            dispatch(createProduct(token, data));
        } else if (openModal.type === "Tag") {
            if (openModal.mode === 'create') {
                console.log(data);
                dispatch(createTag(token, data));
            } else {
                // dispatch(editTag(token, data));
            }
        } else if (openModal.type === "Category") {
            if (openModal.mode === 'create') {
                dispatch(createCategory(token, data));
            } 
        }
        setOpenModal({ isOpen: false, type: null, mode: 'create', data: null });
    };

    const mainFeatures = [
        {
            title: 'Product',
            description: 'Manage your product inventory',
            action: 'ADD PRODUCT',
            icon: Plus,
        },
        {
            title: 'Category',
            description: 'Structure your catalog',
            action: 'ADD CATEGORY',
            icon: Grid,
        }
    ];

    const handleEdit = (type, item) => {
        setOpenModal({
            isOpen: true,
            type,
            mode: 'edit',
            data: item
        });
    };

    return (
        <div className="bg-white mt-10 px-8 py-10">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Main Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mainFeatures.map((feature) => (
                        <div key={feature.title} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-sky-100 rounded-lg">
                                        <feature.icon className="w-5 h-5 text-sky-600" />
                                    </div>
                                    <h3 className="text-sky-900 font-medium">{feature.title}</h3>
                                </div>
                                <button
                                    className="bg-sky-100 text-sky-800 px-4 py-1.5 rounded-full text-sm hover:bg-sky-200 transition-colors"
                                    onClick={() => setOpenModal({ 
                                        isOpen: true, 
                                        type: feature.title,
                                        mode: 'create',
                                        data: null
                                    })}
                                >
                                    {feature.action}
                                </button>
                            </div>
                            <p className="text-sky-600/70 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Tag Management Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <Tags className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <h3 className="text-sky-900 font-medium">Tag Management</h3>
                                <p className="text-sky-600/70 text-sm">Organize and categorize your products</p>
                            </div>
                        </div>
                        <button
                            className="bg-sky-100 text-sky-800 px-4 py-1.5 rounded-full text-sm hover:bg-sky-200 transition-colors"
                            onClick={() => setOpenModal({ 
                                isOpen: true, 
                                type: 'Tag',
                                mode: 'create',
                                data: null
                            })}
                        >
                            ADD TAG
                        </button>
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tags?.map((tag) => (
                            <div 
                                key={tag.id} 
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-sky-600" />
                                    <span className="text-sm text-gray-600">{tag.name}</span>
                                </div>
                                <button
                                    onClick={() => handleEdit('Tag', tag)}
                                    className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-lg"
                                    title="Edit tag"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>

            {/* Modals */}
            {openModal.type === 'Product' && (
                <ProductModal
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null, mode: 'create', data: null })}
                    onSubmit={handleSubmit}
                    initialData={openModal.data}
                />
            )}

            {openModal.type === 'Category' && (
                <CategoryModal
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null, mode: 'create', data: null })}
                    onSubmit={handleSubmit}
                    initialData={openModal.data}
                />
            )}

            {openModal.type === 'Tag' && (
                <TagModal
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null, mode: 'create', data: null })}
                    onSubmit={handleSubmit}
                    initialData={openModal.data}
                />
            )}
        </div>
    );
}

export default Feature;