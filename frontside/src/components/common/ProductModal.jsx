import React, { useEffect, useState } from 'react';
import { Search, X, Upload, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategorys } from '../../services/middlewares/category';
import { getAllTags } from '../../services/middlewares/tag';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { category, tag } = useSelector((state) => state.appdata);

  const [formData, setFormData] = useState({
    name: '',
    salesPrice: 0,
    mrp: 0,
    packageSize: 0,
    images: [],
    categoryName: '',
    sell: false,
    stock: 0,
    tags: [],
  });

  const [errors, setErrors] = useState({
    name: '',
    salesPrice: '',
    mrp: '',
    packageSize: '',
    images: '',
    categoryName: '',
    stock: '',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setErrors({});
    }
  }, [initialData]);

  const [tagSearch, setTagSearch] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);

  
  const validateField = (name, value, allValues = formData) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Product name is required';
        if (value.length < 3) return 'Product name must be at least 3 characters';
        if (value.length > 100) return 'Product name must be less than 100 characters';
        return '';

      case 'salesPrice':
        if (!value && value !== 0) return 'Sales price is required';
        const salesPriceNum = Number(value);
        if (isNaN(salesPriceNum) || salesPriceNum <= 0) return 'Sales price must be greater than 0';
        const mrpNum = Number(allValues.mrp);
        if (allValues.mrp && !isNaN(mrpNum) && salesPriceNum > mrpNum) {
          return 'Sales price cannot be greater than MRP';
        }
        return '';

      case 'mrp':
        if (!value && value !== 0) return 'MRP is required';
        const mrpValue = Number(value);
        if (isNaN(mrpValue) || mrpValue <= 0) return 'MRP must be greater than 0';
        const salesPrice = Number(allValues.salesPrice);
        if (allValues.salesPrice && !isNaN(salesPrice) && mrpValue < salesPrice) {
          return 'MRP cannot be less than sales price';
        }
        return '';

      case 'packageSize':
        if (!value && value !== 0) return 'Package size is required';
        const packageNum = parseInt(value);
        if (isNaN(packageNum) || packageNum <= 0) return 'Package size must be greater than 0';
        if (!Number.isInteger(packageNum)) return 'Package size must be a whole number';
        return '';

      case 'categoryName':
        if (!value) return 'Category is required';
        return '';

      case 'stock':
        if (value === '') return '';
        const stockNum = parseInt(value);
        if (isNaN(stockNum) || stockNum < 0) return 'Stock cannot be negative';
        if (!Number.isInteger(stockNum)) return 'Stock must be a whole number';
        return '';

      case 'images':
        if (!value || value.length === 0) return 'At least one image is required';
        if (value.length > 3) return 'Maximum 3 images allowed';
        return '';

      case 'tags':
        if (!value || value.length === 0) return 'At least one tag is required';
        return '';

      default:
        return '';
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    
    setFormData(newFormData);

    if (name === 'mrp' || name === 'salesPrice') {
      const salesPriceError = validateField('salesPrice', newFormData.salesPrice, newFormData);
      const mrpError = validateField('mrp', newFormData.mrp, newFormData);
      
      setErrors(prev => ({
        ...prev,
        salesPrice: salesPriceError,
        mrp: mrpError,
      }));
    } else {
      const error = validateField(name, value, newFormData);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };
  const uploadImages = async (files) => {
    const urls = [];
    const allowedExtensions = ['png', 'jpeg', 'webp'];
  
    try {
      for (const file of files) {
        // Check if file size is greater than 5MB
        if (file.size > 5000000) {
          setErrors(prev => ({
            ...prev,
            images: 'Each image must be less than 5MB',
          }));
          return [];
        }
  
        // Check file extension
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          setErrors(prev => ({
            ...prev,
            images: 'Only PNG, JPEG, and WEBP image formats are allowed',
          }));
          return [];
        }
  
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', 'firstpresetholyvision');
        const response = await fetch('https://api.cloudinary.com/v1_1/dkuddiipk/image/upload', {
          method: 'POST',
          body: form,
        });
        const data = await response.json();
        urls.push(data.secure_url);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        images: 'Error uploading images. Please try again.',
      }));
    }
    return urls;
  };
  
  const handleImageUpload = async (e) => {
    const files = e.target.files;
  
    if (files.length + formData.images.length > 3) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 3 images allowed',
      }));
      return;
    }

    const uploadedUrls = await uploadImages(files);
    if (uploadedUrls.length > 0) {
      const newImages = [...formData.images, ...uploadedUrls];
      setFormData(prev => ({
        ...prev,
        images: newImages,
      }));
      setErrors(prev => ({
        ...prev,
        images: validateField('images', newImages),
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    setErrors(prev => ({
      ...prev,
      images: validateField('images', newImages),
    }));
  };

  const handleTagAdd = (selectedTag) => {
    const newTags = [...formData.tags, selectedTag];
    setFormData(prev => ({
      ...prev,
      tags: newTags,
    }));
    setErrors(prev => ({
      ...prev,
      tags: validateField('tags', newTags),
    }));
    setTagSearch('');
  };

  const handleTagRemove = (tagToRemove) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      tags: newTags,
    }));
    setErrors(prev => ({
      ...prev,
      tags: validateField('tags', newTags),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    if (tagSearch.trim()) {
      const filtered = tag.filter(
        (t) =>
          t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
          !formData.tags.includes(t.name)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  }, [tagSearch, tag, formData.tags]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sky-900/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex justify-between items-center p-6 border-b border-sky-100">
              <h2 className="text-3xl font-semibold text-sky-900">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-sky-500 hover:text-sky-700 p-2 rounded-full hover:bg-sky-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      name="name"
                      onChange={handleOnChange}
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Sales Price</label>
                    <input
                      type="number"
                      value={formData.salesPrice}
                      name="salesPrice"
                      onChange={handleOnChange}
                      className={`w-full border ${errors.salesPrice ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                      placeholder="Enter sales price"
                    />
                    {errors.salesPrice && <p className="text-red-500 text-sm">{errors.salesPrice}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">MRP</label>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleOnChange}
                      className={`w-full border ${errors.mrp ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                      placeholder="Enter MRP"
                    />
                    {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Package Size</label>
                    <input
                      type="number"
                      value={formData.packageSize}
                      name="packageSize"
                      onChange={handleOnChange}
                      className={`w-full border ${errors.packageSize ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                      placeholder="Enter package size"
                    />
                    {errors.packageSize && <p className="text-red-500 text-sm">{errors.packageSize}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sky-900 font-medium">Images</label>
                  <div className={`border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-sky-200'} rounded-xl p-6`}>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpeg,.webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-sky-500" />
                      <span className="text-sky-900">Click to upload images</span>
                      <span className="text-sky-500 text-sm">or drag and drop them here</span>
                      <span className="text-sky-400 text-sm">
                        {formData.images.length}/3 images selected
                      </span>
                      <span className="text-sky-400 text-sm">
                        Allowed formats: PNG, JPEG, WEBP
                      </span>
                    </label>
                  </div>
                  {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-4 mt-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sky-900 font-medium">Category</label>
                <select
                  value={formData.categoryName}
                  name="categoryName"
                  onChange={handleOnChange}
                  className={`w-full border ${errors.categoryName ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                >
                  <option value="">Select Category</option>
                  {category.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName}</p>}
              </div>


              {/* Tags Field */}
              <div className="space-y-2">
                <label className="text-sky-900 font-medium">Tags</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-sky-400 w-5 h-5" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags"
                    className="w-full border border-sky-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                {filteredTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filteredTags.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTagAdd(t.name)}
                        className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full hover:bg-sky-200 transition-colors"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="text-sky-500 hover:text-sky-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Stock Field */}
                <div className="space-y-2">
                  <label className="text-sky-900 font-medium">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    name="stock"
                    onChange={handleOnChange}
                    min="0"
                    className={`w-full border ${errors.stock ? 'border-red-500' : 'border-sky-200'} p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                    placeholder="Enter stock quantity"
                  />
                  {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                </div>

                {/* Sell Field */}
                <div className="space-y-2">
                  <label className="text-sky-900 font-medium">Sell</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.sell}
                      onChange={(e) => setFormData({ ...formData, sell: e.target.checked })}
                      className="w-5 h-5 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <span className="text-gray-700">Enable for sale</span>
                  </div>
                  {/* {errors.sell && <p className="text-red-500 text-sm">{errors.sell}</p>} */}
                </div>
              </div>


            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white rounded-b-2xl p-6 border-t border-sky-100">
              <button
                type="submit"
                className="w-full bg-sky-500 text-white px-6 py-3 rounded-xl hover:bg-sky-600 transition-colors"
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