import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Mock Payment');
  const [loading, setLoading] = useState(false);
  
  // Process mock payment
  const processMockPayment = async (amount) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random transaction ID
    const transactionId = 'MOCK-' + Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    
    // 100% success rate for testing purposes
    const success = true;
    
    console.log('Mock payment processed:', { transactionId, amount, success });
    
    return {
      success,
      transactionId,
      amount,
      currency: 'USD',
      timestamp: new Date().toISOString()
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    for (const field in shippingAddress) {
      if (!shippingAddress[field]) {
        toast.error(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Create order items from cart
      const orderItems = cartItems.map(item => ({
        product: item.productId, // Always use productId from cart, which should be the MongoDB ObjectId
        name: item.name,
        color: item.color || '',
        size: item.size || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variantId: item.variantId || ''
      }));
      
      // Calculate total price (with shipping and tax)
      const shipping = totalPrice > 100 ? 0 : 10;
      const tax = totalPrice * 0.1;
      const orderTotalPrice = totalPrice + shipping + tax;
      
      // Process mock payment
      console.log('Processing mock payment...');
      const mockPaymentResponse = await processMockPayment(orderTotalPrice);
      console.log('Mock payment response:', mockPaymentResponse);
      
      if (mockPaymentResponse.success) {
        console.log('Creating order...');
        // Create order with payment info
        const orderData = {
          orderItems,
          shippingAddress,
          paymentMethod,
          totalPrice: orderTotalPrice,
          paymentResult: {
            id: mockPaymentResponse.transactionId,
            status: 'Paid',
            update_time: new Date().toISOString(),
            email_address: user?.email || 'customer@example.com'
          }
        };
        
        console.log('Order data:', orderData);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }

        // Set authorization header
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/orders`, 
            orderData,
            config
          );

          console.log('Order created:', data);
          // Defensive: log the data object to debug missing _id
          if (!data._id) {
            console.warn('Order response missing _id:', data);
          }

          // Clear cart
          clearCart();

          // Show success message
          toast.success('Payment successful! Order placed successfully!');

          // Redirect to order confirmation or fallback
          if (data._id) {
            navigate(`/orders/${data._id}`);
          } else {
            navigate('/orders');
          }
        } catch (error) {
          console.error('Order creation error:', error);
          toast.error(error.response?.data?.message || 'Failed to create order. Please try again.');
        }
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
          Your cart is empty. Please add items to your cart before checkout.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mockPayment"
                      name="paymentMethod"
                      value="Mock Payment"
                      checked={paymentMethod === 'Mock Payment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="mockPayment">Mock Payment (for testing)</label>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="Credit Card"
                      disabled
                      className="mr-2"
                    />
                    <label htmlFor="creditCard">Credit Card (not available in demo)</label>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="PayPal"
                      disabled
                      className="mr-2"
                    />
                    <label htmlFor="paypal">PayPal (not available in demo)</label>
                  </div>
                </div>
              </div>

              {/* Order Review */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                
                <div className="border-b pb-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 text-sm"> ({item.color}, {item.size})</span>
                        <span className="text-gray-600"> x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
