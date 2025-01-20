import React, { useState } from 'react';

const TagModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    active: true
  });

  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};

    if (!data.name || data.name.length < 2 || data.name.length > 50) {
      newErrors.name = 'Tag name must be between 2 and 50 characters';
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(data.name)) {
      newErrors.name = 'Tag name can only contain letters, numbers, spaces, and hyphens';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-sky-900">
              {initialData ? 'Edit Tag' : 'Add New Tag'}
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
            {/* Tag Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter tag name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

      

            {/* Active Status */}
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={e => setFormData({...formData, active: e.target.checked})}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div> */}

            {/* Submit Buttons */}
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
                {initialData ? 'Update Tag' : 'Add Tag'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagModal;