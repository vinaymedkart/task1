import React, { useState } from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    salesPrice: '',
    mrp: '',
    packageSize: '',
    images: [],
    categoryId: '',
    sell: true,
    description: '',
    stock: 0
  });
  
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    
    // Name validation
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-\.]+$/.test(data.name)) {
      newErrors.name = 'Name can only contain letters, numbers, spaces, hyphens, and dots';
    }

    // Price validation
    if (!data.salesPrice || data.salesPrice < 0.01 || data.salesPrice > 999999.99) {
      newErrors.salesPrice = 'Sales price must be between 0.01 and 999,999.99';
    }
    
    if (!data.mrp || data.mrp < data.salesPrice || data.mrp > 999999.99) {
      newErrors.mrp = 'MRP must be greater than sales price and less than 999,999.99';
    }

    // Package size validation
    if (!data.packageSize || data.packageSize < 0.001 || data.packageSize > 9999.999) {
      newErrors.packageSize = 'Package size must be between 0.001 and 9,999.999';
    }

    // Images validation
    if (!data.images.length) {
      newErrors.images = 'At least one image is required';
    }
    if (data.images.length > 10) {
      newErrors.images = 'Maximum 10 images allowed';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 10)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-sky-900">
              {initialData ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salesPrice}
                  onChange={e => setFormData({...formData, salesPrice: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                  placeholder="0.00"
                />
                {errors.salesPrice && <p className="text-red-500 text-sm mt-1">{errors.salesPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MRP
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={e => setFormData({...formData, mrp: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                  placeholder="0.00"
                />
                {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
              </div>
            </div>

            {/* Package Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Size
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.packageSize}
                onChange={e => setFormData({...formData, packageSize: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                placeholder="0.000"
              />
              {errors.packageSize && <p className="text-red-500 text-sm mt-1">{errors.packageSize}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              />
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              <div className="grid grid-cols-5 gap-2 mt-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select a category</option>
                {/* Add your categories here */}
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
              </select>
            </div>

            {/* Stock Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                min="0"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                rows="4"
                placeholder="Enter product description"
              />
            </div>

            {/* Sell Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.sell}
                onChange={e => setFormData({...formData, sell: e.target.checked})}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Available for sale
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
              >
                {initialData ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;