import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRiderOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/rider`
        );
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchRiderOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Assigned Orders</h2>
      {orders.length === 0 ? (
        <div>No orders assigned.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li
              key={order._id}
              className="p-4 border rounded bg-white shadow cursor-pointer hover:bg-blue-50"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Customer:</strong> {order.user?.name || 'N/A'}</div>
              <div><strong>Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}</div>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrdersPage;
