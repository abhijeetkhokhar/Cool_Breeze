// RiderOrdersPage removed as part of rider functionality elimination.
      } catch (err) {
        setError('Failed to load rider orders.');
        setLoading(false);
      }
    };
    fetchRiderOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Rider Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No orders assigned.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td className="py-2 px-4 border-b">{order._id}</td>
                    <td className="py-2 px-4 border-b">{order.user?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{order.shippingAddress?.street}, {order.shippingAddress?.city}</td>
                    <td className="py-2 px-4 border-b">{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiderOrdersPage;
