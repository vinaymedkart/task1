import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const ProductFilters = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const { tag, category } = useSelector((state) => state.appdata);
    const [searchInput, setSearchInput] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [tagSearch, setTagSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({
                searchbar: searchInput,
                tags: selectedTags,
                categories: selectedCategories
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleTagSelect = (tagName) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName];

            onFilterChange({
                searchbar: searchInput,
                tags: newTags,
                categories: selectedCategories
            });
            return newTags;
        });
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName];

            onFilterChange({
                searchbar: searchInput,
                tags: selectedTags,
                categories: newCategories
            });
            return newCategories;
        });
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(prev => {
            const newTags = prev.filter(tag => tag !== tagToRemove);
            onFilterChange({
                searchbar: searchInput,
                tags: newTags,
                categories: selectedCategories
            });
            return newTags;
        });
    };

    const removeCategory = (categoryToRemove) => {
        setSelectedCategories(prev => {
            const newCategories = prev.filter(category => category !== categoryToRemove);
            onFilterChange({
                searchbar: searchInput,
                tags: selectedTags,
                categories: newCategories
            });
            return newCategories;
        });
    };

    const filteredTags = tag.filter(t =>
        t.name.toLowerCase().includes(tagSearch.toLowerCase())
    );

    const filteredCategories = category.filter(c =>
        c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col space-y-4">
                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by product name or WS code..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {/* Tags Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            Tags ({selectedTags.length})
                        </button>

                        {showTagDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredTags.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-500">No tags found</div>
                                    ) : (
                                        filteredTags.map((t) => (
                                            <div
                                                key={t.name}
                                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleTagSelect(t.name)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(t.name)}
                                                    readOnly
                                                    className="mr-2"
                                                />
                                                <span>{t.name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Categories Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            Categories ({selectedCategories.length})
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredCategories.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-500">No categories found</div>
                                    ) : (
                                        filteredCategories.map((c) => (
                                            <div
                                                key={c.name}
                                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleCategorySelect(c.name)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(c.name)}
                                                    readOnly
                                                    className="mr-2"
                                                />
                                                <span>{c.name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Filters */}
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                            {tag}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-gray-600"
                                onClick={() => removeTag(tag)}
                            />
                        </span>
                    ))}
                    {selectedCategories.map((category) => (
                        <span
                            key={category}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                            {category}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-gray-600"
                                onClick={() => removeCategory(category)}
                            />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;