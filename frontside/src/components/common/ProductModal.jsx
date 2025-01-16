import React, { useEffect, useState } from 'react';
import { Search, X, Upload, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategorys } from '../../services/middlewares/category';
import { getAllTags } from '../../services/middlewares/tag';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    salesPrice: '',
    mrp: '',
    packageSize: '',
    images: [],
    categoryId: '',
    sell: true,
    stock: 0,
    tags: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [errors, setErrors] = useState({});

  const { token } = useSelector((state) => state.auth);
  const { tag, category } = useSelector((state) => state.appdata);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllTags(token));
    dispatch(getAllCategorys(token));
  }, []);
  useEffect(() => {
    if (initialData) {
        setFormData({
            name: initialData.name || '',
            salesPrice: initialData.salesPrice || '',
            mrp: initialData.mrp || '',
            packageSize: initialData.packageSize || '',
            images: initialData.images || [],
            categoryId: initialData.categoryId || '',
            sell: initialData.sell ?? true,
            stock: initialData.stock || 0,
            tags: initialData.tags || [],
        });

        // Set preview URLs for existing images
        if (initialData.images && initialData.images.length > 0) {
            setPreviewUrls(initialData.images);
        }
    }
}, [initialData]);


  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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

  const handleTagAdd = (selectedTag) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, selectedTag],
    }));
    setTagSearch('');
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateImageFormat = (file) => {
    const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
    if (!validFormats.includes(file.type)) {
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 10 - selectedFiles.length);
    
    // Validate image formats
    const invalidFiles = newFiles.filter(file => !validateImageFormat(file));
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: "Only .png, .jpeg, .jpg, and .webp formats are allowed"
      }));
      return;
    }

    // Clear image error if present
    setErrors(prev => ({
      ...prev,
      images: undefined
    }));
    
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (data) => {
    const newErrors = {};
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }
    if (!data.salesPrice || data.salesPrice < 0.01 || data.salesPrice > 999999.99) {
      newErrors.salesPrice = 'Sales price must be between 0.01 and 999,999.99';
    }
    if (!data.mrp || data.mrp < data.salesPrice || data.mrp > 999999.99) {
      newErrors.mrp = 'MRP must be greater than sales price and less than 999,999.99';
    }
    if (!data.packageSize || data.packageSize < 0.001 || data.packageSize > 9999.999) {
      newErrors.packageSize = 'Package size must be between 0.001 and 9,999.999';
    }
    if (!selectedFiles.length) {
      newErrors.images = 'At least one image is required';
    }
    // Validate image formats during form submission
    const invalidFiles = selectedFiles.filter(file => !validateImageFormat(file));
    if (invalidFiles.length > 0) {
      newErrors.images = "Only .png, .jpeg, .jpg, and .webp formats are allowed";
    }
    if (!data.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!data.tags.length) {
      newErrors.tags = 'At least one tag is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
        const submissionData = {
            wsCode: initialData?.wsCode, 
            name: formData.name,
            salesPrice: Number(formData.salesPrice),
            mrp: Number(formData.mrp),
            packageSize: Number(formData.packageSize),
            categoryId: formData.categoryId,
            sell: formData.sell,
            stock: Number(formData.stock),
            tags: formData.tags,
            images: selectedFiles.length > 0 ? selectedFiles : previewUrls // Use existing images if no new ones uploaded
        };
        console.log('Submitting updated data:', submissionData);
        onSubmit(submissionData);
    } else {
        setErrors(validationErrors);
    }
};

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
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-sky-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Sales Price</label>
                    <input
                      type="number"
                      value={formData.salesPrice}
                      onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                      className="w-full border border-sky-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {errors.salesPrice && <p className="text-red-500 text-sm">{errors.salesPrice}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">MRP</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      className="w-full border border-sky-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sky-900 font-medium">Package Size</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.packageSize}
                      onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                      className="w-full border border-sky-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="0.000"
                    />
                    {errors.packageSize && <p className="text-red-500 text-sm">{errors.packageSize}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sky-900 font-medium">Images</label>
                  <div className="border-2 border-dashed border-sky-200 rounded-xl p-6">
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.webp"
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
                        {selectedFiles.length}/10 images selected
                      </span>
                      <span className="text-sky-400 text-sm">
                        Allowed formats: PNG, JPEG, JPG, WEBP
                      </span>
                    </label>
                  </div>
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-5 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sky-900 font-medium">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-sky-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {category.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                </div>

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