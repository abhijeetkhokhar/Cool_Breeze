import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Form state
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // Fetch order details
        const { data: orderData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`);
        setOrder(orderData);
        setNewStatus(orderData.status);
        
        
        
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    // No rider validation needed anymore
    
    try {
      setUpdatingStatus(true);
      
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}/status`, {
        status: newStatus
      });
      
      setOrder(data);
      toast.success(`Order status updated to ${newStatus}`);
      
      setUpdatingStatus(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      
      // If there's an invalid transition error, provide a more helpful message
      if (errorMessage.includes('Invalid status transition')) {
        toast.error(`${errorMessage}. Please restart the server to apply recent backend changes.`);
      } else {
        toast.error(errorMessage);
      }
      
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Undelivered':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
        {error}
        <button 
          className="ml-4 underline text-primary"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-4">
        Order not found
        <button 
          className="ml-4 underline text-primary"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Order Details</h1>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Order #{order._id}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              
              {order.isPaid && (
                <div>
                  <p className="text-gray-600 text-sm">Paid At</p>
                  <p className="font-medium">{formatDate(order.paidAt)}</p>
                </div>
              )}
              
              {order.isDelivered && (
                <div>
                  <p className="text-gray-600 text-sm">Delivered At</p>
                  <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                </div>
              )}
              
              
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-600 text-sm">
                        Color: {item.color}, Size: {item.size}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Shipping Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{order.user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{order.user?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Order Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Order Status</h2>
        
        <form onSubmit={handleStatusUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                className="input-field"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Undelivered">Undelivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            
          </div>
          
          <div className="mt-4">
            <button
              type="submit"
              className="btn-primary"
              disabled={updatingStatus || order.status === newStatus}
            >
              {updatingStatus ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetailPage;
