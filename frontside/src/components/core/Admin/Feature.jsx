import React, { useState } from 'react';
import ProductModal from '../../common/ProductModal';
import CategoryModal from '../../common/CategoryModal'; // import CategoryModal
import TagModal from '../../common/TagModal'; // import TagModal

function Feature() {
    // Track which modal is open using the title
    const [openModal, setOpenModal] = useState({
        isOpen: false,
        type: null
    });

    const handleSubmit = (data) => {
        // Handle the product, tag, or category submission here based on type
        console.log('Submitted data for:', openModal.type, data);
    };

    const features = [
        {
            title: 'Product',
            description: 'Manage your product inventory',
            action: 'ADD PRODUCT'
        },
        {
            title: 'Tag',
            description: 'Organize with tags',
            action: 'ADD TAG'
        },
        {
            title: 'Category',
            description: 'Structure your catalog',
            action: 'ADD CATEGORY'
        },
        {
            title: 'Customers',
            description: 'View customer details',
            action: 'VIEW DETAILS'
        }
    ];

    return (
        <div className="bg-white mt-24 px-8 py-16">
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="text-center">
                        <div className="w-24 h-24 bg-sky-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-sky-600/20 rounded-full"></div>
                        </div>
                        <h3 className="text-sky-900 font-medium mb-2">{feature.title}</h3>
                        <p className="text-sky-600/70 text-sm mb-4">
                            {feature.description}
                        </p>
                        <button 
                            className="bg-sky-100 text-sky-800 px-6 py-2 rounded-full text-sm hover:bg-sky-200 transition-colors"
                            onClick={() => setOpenModal({ isOpen: true, type: feature.title })}
                        >
                            {feature.action}
                        </button>
                    </div>
                ))}
            </div>

            {/* Render Modals based on the selected type */}
            {openModal.type === 'Product' && (
                <ProductModal 
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null })}
                    onSubmit={handleSubmit}
                />
            )}

            {openModal.type === 'Category' && (
                <CategoryModal 
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null })}
                    onSubmit={handleSubmit}
                />
            )}

            {openModal.type === 'Tag' && (
                <TagModal 
                    isOpen={openModal.isOpen}
                    onClose={() => setOpenModal({ isOpen: false, type: null })}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}

export default Feature;
