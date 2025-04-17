import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-xl mx-auto py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">&larr; Back</button>
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="bg-white p-6 rounded shadow mb-4">
        <div><strong>Order ID:</strong> {order._id}</div>
        <div><strong>Status:</strong> {order.status}</div>
        <div><strong>Customer:</strong> {order.user?.name || 'N/A'}</div>
        <div><strong>Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}</div>
        {/* Add more details as needed */}
      </div>
      <div className="flex gap-4">
        {order.status === 'Assigned' && (
          <button onClick={() => handleStatusChange('Picked Up')} disabled={actionLoading} className="bg-yellow-500 text-white px-4 py-2 rounded">Mark as Picked Up</button>
        )}
        {order.status === 'Picked Up' && (
          <button onClick={() => handleStatusChange('Delivered')} disabled={actionLoading} className="bg-green-600 text-white px-4 py-2 rounded">Mark as Delivered</button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
