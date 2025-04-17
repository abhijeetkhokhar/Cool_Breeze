import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
      <p className="text-lg mb-2">Thank you for your purchase.</p>
      {orderId && (
        <p className="mb-2">Your Order ID: <span className="font-mono text-blue-600">{orderId}</span></p>
      )}
      <Link to="/products" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmationPage;
