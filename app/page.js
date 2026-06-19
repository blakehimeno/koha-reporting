'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_MAP = {
  0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  1: { label: 'Processed', color: 'bg-green-100 text-green-800' },
  2: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—';
  const formatCurrency = (n) => n != null ? `$${parseFloat(n).toFixed(2)}` : '—';

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Koha Foods</h1>
          <p className="text-gray-500 mt-1">50 Most Recent Orders</p>
        </div>

        {loading && <div className="text-center py-20 text-gray-400">Loading orders...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">Error: {error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Confirmation #</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Order Date</th>
                    <th className="px-4 py-3 text-left">Delivery Date</th>
                    <th className="px-4 py-3 text-right">Lines</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const status = STATUS_MAP[order.ElectronicStatus] || { label: 'Unknown', color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr
                        key={order.ConfirmationNumber}
                        onClick={() => router.push(`/orders/${order.ConfirmationNumber}`)}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-medium text-blue-600">{order.ConfirmationNumber}</td>
                        <td className="px-4 py-3 text-gray-900">{order.CustomerCode?.trim()}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(order.OrderDate)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(order.DeliveryDate)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{order.LineCount}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(order.OrderTotal)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}