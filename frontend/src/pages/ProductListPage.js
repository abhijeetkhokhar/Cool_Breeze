import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';

const ProductListPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get filter params from URL
  const categoryParam = queryParams.get('category');
  const colorParam = queryParams.get('color');
  const sizeParam = queryParams.get('size');
  
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryParam || '',
    color: colorParam || '',
    size: sizeParam || ''
  });
  
  // Get unique colors and sizes from all products
  const allColors = [...new Set(products.flatMap(product => product.colors))];
  const allSizes = [...new Set(products.flatMap(product => product.sizes))];
  const allCategories = [...new Set(products.map(product => product.category))];
  
  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    // Filter by color
    if (filters.color && !product.colors.includes(filters.color)) {
      return false;
    }
    // Filter by size
    if (filters.size && !product.sizes.includes(filters.size)) {
      return false;
    }
    return true;
  });
  // Only display up to 8 products
  const displayedProducts = filteredProducts.slice(0, 8);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      color: '',
      size: ''
    });
  };
  
  // Open variant selection modal
  const openVariantModal = (product, e) => {
    e.preventDefault(); // Prevent navigation to product detail page
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]);
    setShowVariantModal(true);
  };
  
  // Close variant selection modal
  const closeVariantModal = () => {
    setShowVariantModal(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };
  
  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };
  
  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;
    
    console.log('Selected variant for cart:', selectedVariant);
    
    // Make sure the variant has all required properties
    if (!selectedVariant.id) {
      console.error('Variant missing ID');
      return;
    }
    
    const result = addToCart(selectedProduct, selectedVariant, 1);
    console.log('Add to cart result:', result);
    
    if (result.success) {
      // Show "Added to cart" message for this product
      setAddedToCart(prev => ({
        ...prev,
        [selectedProduct._id]: true
      }));
      
      // Reset the message after 2 seconds
      setTimeout(() => {
        setAddedToCart(prev => ({
          ...prev,
          [selectedProduct._id]: false
        }));
      }, 2000);
      
      // Close the modal
      closeVariantModal();
    } else {
      console.error('Failed to add to cart:', result.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {/* Top Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-2">Color</label>
          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Colors</option>
            {allColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-2">Size</label>
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Sizes</option>
            {allSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded w-full md:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {/* Product Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center relative group text-center"
            >
              {/* Featured badge */}
              {product.featured && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
                  Featured
                </span>
              )}
              <Link to={`/products/${product._id}`} className="block w-full overflow-hidden rounded-t-2xl">
                <img
                  src={product.featuredImage}
                  alt={product.name}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <div className="p-5 flex-1 w-full flex flex-col items-center justify-between">
                <h2 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h2>
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{product.category}</p>
                {/* Price Range */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}
                  </span>
                  {product.variants.length > 1 && (
                    <span className="text-sm text-gray-500">
                      - ${Math.max(...product.variants.map(v => v.price)).toFixed(2)}
                    </span>
                  )}
                </div>
                {/* Color Swatches */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {product.colors.map(color => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f9fafb' : color.toLowerCase() }}
                      title={color}
                    ></span>
                  ))}
                </div>
                {/* Sizes as badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {product.sizes.map(size => (
                    <span
                      key={size}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => openVariantModal(product, e)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold shadow transition-colors duration-150 text-base mt-2 ${addedToCart[product._id] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {addedToCart[product._id] ? 'Added to Cart!' : 'Select Options'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Variant Selection Modal */}
      {showVariantModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
              <button onClick={closeVariantModal} className="text-gray-500 hover:text-gray-700">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png" alt="Close" className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      const newVariant = selectedProduct.variants.find(v => v.color === color && v.size === (selectedVariant?.size || selectedProduct.sizes[0]));
                      if (newVariant) handleVariantChange(newVariant);
                    }}
                    className={`px-3 py-1 border rounded ${selectedVariant?.color === color ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      const newVariant = selectedProduct.variants.find(v => v.size === size && v.color === (selectedVariant?.color || selectedProduct.colors[0]));
                      if (newVariant) handleVariantChange(newVariant);
                    }}
                    className={`px-3 py-1 border rounded ${selectedVariant?.size === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {selectedVariant && (
              <div className="mb-4">
                <p className="text-gray-800 font-bold">${selectedVariant.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{selectedVariant.stock} in stock</p>
              </div>
            )}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              disabled={!selectedVariant}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
