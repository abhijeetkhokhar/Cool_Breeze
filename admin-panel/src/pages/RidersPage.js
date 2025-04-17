import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RidersPage = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRiderEmail, setNewRiderEmail] = useState('');
  const [addingRider, setAddingRider] = useState(false);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/riders`);
      setRiders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching riders:', error);
      setError('Failed to load riders. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    
    if (!newRiderEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    try {
      setAddingRider(true);
      
      // Add email to approved emails list with rider role
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/approved-emails`, {
        email: newRiderEmail,
        role: 'rider'
      });
      
      toast.success(`${newRiderEmail} added to approved riders list`);
      setNewRiderEmail('');
      
      // Refresh riders list
      fetchRiders();
      
      setAddingRider(false);
    } catch (error) {
      console.error('Error adding rider:', error);
      toast.error(error.response?.data?.message || 'Failed to add rider');
      setAddingRider(false);
    }
  };

  // Get rider orders
  const getRiderOrders = async (riderId) => {
    try {
      const { data: orders } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
      return orders.filter(order => order.rider && order.rider._id === riderId).length;
    } catch (error) {
      console.error('Error fetching rider orders:', error);
      return 0;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Riders</h1>
        <button 
          className="btn-primary flex items-center"
          onClick={fetchRiders}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Add New Rider */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Rider</h2>
        <form onSubmit={handleAddRider} className="flex items-end space-x-4">
          <div className="flex-grow">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={newRiderEmail}
              onChange={(e) => setNewRiderEmail(e.target.value)}
              placeholder="rider@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary h-10"
            disabled={addingRider}
          >
            {addingRider ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Rider'
            )}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-2">
          Adding a rider will add their email to the approved list. The rider will need to sign in with Google using this email.
        </p>
      </div>

      {/* Riders List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : riders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700">No riders found. Add a rider to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riders.map((rider) => (
                  <tr key={rider._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 font-semibold">{rider.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rider.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rider.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* This would be better to fetch from the backend in a real app */}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {rider.assignedOrders || '0'} orders
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RidersPage;
