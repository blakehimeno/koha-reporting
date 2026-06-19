'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const STATUS_MAP = {
  0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  1: { label: 'Processed', color: 'bg-green-100 text-green-800' },
  2: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export default function OrderDetail() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setLines(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—';
  const formatCurrency = (n) => n != null ? `$${parseFloat(n).toFixed(2)}` : '—';

  const orderTotal = lines.reduce((sum, l) => sum + (l.OrderQuantity * l.OverridePrice), 0);
  const first = lines[0];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to Orders
        </button>

        {loading && <div className="text-center py-20 text-gray-400">Loading order...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">Error: {error}</div>}

        {!loading && !error && first && (
          <>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{id}</h1>
                  <p className="text-gray-500 mt-1">Customer: <span className="text-gray-800 font-medium">{first.CustomerCode?.trim()}</span></p>
                  {first.Customer_PO && <p className="text-gray-500">PO: <span className="text-gray-800">{first.Customer_PO}</span></p>}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Order Date: {formatDate(first.OrderDate)}</p>
                  <p className="text-gray-500 text-sm">Delivery Date: {formatDate(first.DeliveryDate)}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(orderTotal)}</p>
                  <p className="text-gray-400 text-xs">{lines.length} line items</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Product Code</th>
                    <th className="px-4 py-3 text-left">Warehouse</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Line Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lines.map((line) => {
                    const status = STATUS_MAP[line.ElectronicStatus] || { label: 'Unknown', color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={line.ElectronicCode} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-medium text-gray-800">{line.ProductCode}</td>
                        <td className="px-4 py-3 text-gray-600">{line.ProductWarehouse}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{line.OrderQuantity} {line.UnitOfMeasure_SellBy}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(line.OverridePrice)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(line.OrderQuantity * line.OverridePrice)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right font-semibold text-gray-700">Order Total</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(orderTotal)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}