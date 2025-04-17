import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
    }
  }, []);

  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate totals
    const { total, count } = cartItems.reduce(
      (acc, item) => ({
        total: acc.total + item.price * item.quantity,
        count: acc.count + item.quantity,
      }),
      { total: 0, count: 0 }
    );
    
    setTotalPrice(total);
    setTotalItems(count);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, variant, quantity = 1) => {
    // Check if the variant exists in the product's variants array
    if (!variant || !product.variants.some(v => v.id === variant.id)) {
      console.error('Invalid variant:', variant, 'for product:', product);
      return { success: false, message: 'Selected variant not available' };
    }
    
    console.log('Adding to cart:', { product, variant, quantity });

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.productId === product._id && 
        item.variantId === variant.id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Add new item if it doesn't exist
      // Validate product._id is a valid MongoDB ObjectId (24 hex chars)
      const isValidObjectId = typeof product._id === 'string' && /^[a-fA-F0-9]{24}$/.test(product._id);
      if (!isValidObjectId) {
        console.warn('Invalid product._id for cart:', product._id, product);
        return { success: false, message: 'Invalid product ID. Please refresh and try again.' };
      }
      const newItem = {
        productId: product._id,
        name: product.name,
        price: variant.price,
        variantId: variant.id,
        color: variant.color,
        size: variant.size,
        quantity,
        image: product.featuredImage
      };
      
      setCartItems([...cartItems, newItem]);
    }

    return { success: true };
  };

  // Update item quantity
  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId, variantId);
    }

    const updatedCart = cartItems.map(item => {
      if (
        item.productId === productId && 
        item.variantId === variantId
      ) {
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (productId, variantId) => {
    const updatedCart = cartItems.filter(
      item => 
        !(item.productId === productId && 
          item.variantId === variantId)
    );
    
    setCartItems(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
