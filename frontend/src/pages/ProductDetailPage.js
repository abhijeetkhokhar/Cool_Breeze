import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected options
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(data);
        
        // Set default selections
        if (data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].color);
          setSelectedSize(data.variants[0].size);
          setSelectedVariant(data.variants[0]);
          setMainImage(data.variants[0].images[0] || data.featuredImage);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product && product.variants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      
      if (variant) {
        setSelectedVariant(variant);
        // Update main image if the variant has images
        if (variant.images && variant.images.length > 0) {
          setMainImage(variant.images[0]);
        }
      }
    }
  }, [selectedColor, selectedSize, product]);

  const handleColorChange = (color) => {
    console.log('Color selected:', color);
    setSelectedColor(color);
    
    // Find a variant with the selected color and any size
    const variantsWithColor = product.variants.filter(v => v.color === color);
    if (variantsWithColor.length > 0) {
      // If current size is not available in this color, select the first available size
      const sizeExists = variantsWithColor.some(v => v.size === selectedSize);
      if (!sizeExists) {
        setSelectedSize(variantsWithColor[0].size);
      }
    }
    console.log('Available sizes for selected color:', getAvailableSizes());
  };

  const handleSizeChange = (size) => {
    console.log('Size selected:', size);
    setSelectedSize(size);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    console.log('Trying to add to cart:', {
      product,
      selectedColor,
      selectedSize,
      selectedVariant,
      quantity
    });
    if (!selectedVariant) {
      toast.error('Please select color and size');
      return;
    }
    
    const result = addToCart(product, selectedColor, selectedSize, quantity);
    console.log('Add to cart result:', result);
    
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  // Get available colors (unique)
  const getAvailableColors = () => {
    if (!product || !product.variants) return [];
    return [...new Set(product.variants.map(v => v.color))];
  };

  // Get available sizes for the selected color
  const getAvailableSizes = () => {
    if (!product || !product.variants) return [];
    return [...new Set(
      product.variants
        .filter(v => v.color === selectedColor)
        .map(v => v.size)
    )];
  };

  // Get all images for the selected variant
  const getVariantImages = () => {
    if (!selectedVariant || !selectedVariant.images || selectedVariant.images.length === 0) {
      return [product.featuredImage];
    }
    return selectedVariant.images;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
          Product not found.
        </div>
      </div>
    );
  }

  console.log('Available colors:', getAvailableColors());
  console.log('Available sizes:', getAvailableSizes());
  console.log('Selected color:', selectedColor);
  console.log('Selected size:', selectedSize);
  console.log('Selected variant:', selectedVariant);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2 p-4">
            <div className="mb-4">
              <img 
                src={mainImage || product.featuredImage} 
                alt={product.name} 
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {getVariantImages().map((image, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer border-2 rounded-md w-20 h-20 flex-shrink-0 ${
                    mainImage === image ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'stroke-current'}`} 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 ml-2">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-4">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : '0.00'}
              </div>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Color Selection */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="flex space-x-2">
                  {getAvailableColors().map(color => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color 
                          ? 'border-primary' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => handleColorChange(color)}
                      aria-label={color}
                    ></button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {getAvailableSizes().map(size => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-200 px-3 py-1 rounded-l-md"
                    onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-t border-b py-1"
                  />
                  <button 
                    className="bg-gray-200 px-3 py-1 rounded-r-md"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                <span className={`${
                  selectedVariant && selectedVariant.stock > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                } font-medium`}>
                  {selectedVariant && selectedVariant.stock > 0 
                    ? `In Stock (${selectedVariant.stock} available)` 
                    : 'Out of Stock'}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  className="btn-primary flex-1"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  Add to Cart
                </button>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors flex-1"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  Buy Now
                </button>
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>1-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
