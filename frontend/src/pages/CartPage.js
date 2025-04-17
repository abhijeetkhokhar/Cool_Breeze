import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    updateQuantity(productId, variantId, newQuantity);
  };

  const handleRemoveItem = (productId, variantId) => {
    removeFromCart(productId, variantId);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Product</th>
                    <th className="text-center p-4">Price</th>
                    <th className="text-center p-4">Quantity</th>
                    <th className="text-center p-4">Total</th>
                    <th className="text-center p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={`${item.productId}-${item.variantId}`} className="border-t">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600 text-sm">
                              Color: {item.color}, Size: {item.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-4">${item.price.toFixed(2)}</td>
                      <td className="text-center p-4">
                        <div className="flex items-center justify-center">
                          <button
                            className="bg-gray-200 px-2 py-1 rounded-l"
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            className="bg-gray-200 px-2 py-1 rounded-r"
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-center p-4 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-center p-4">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.productId, item.variantId)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Link to="/products" className="text-primary hover:underline flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>{totalPrice > 100 ? 'Free' : '$10.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>
                  ${(totalPrice + (totalPrice > 100 ? 0 : 10) + totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
              
              <button
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded transition-colors"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center text-gray-600 text-sm">
                <p>We accept:</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <span className="bg-gray-200 rounded px-2 py-1">Visa</span>
                  <span className="bg-gray-200 rounded px-2 py-1">Mastercard</span>
                  <span className="bg-gray-200 rounded px-2 py-1">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
