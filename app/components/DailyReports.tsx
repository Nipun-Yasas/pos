'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { IconChartBar, IconPrinter, IconCash, IconCreditCard, IconTrash } from '@tabler/icons-react';

export default function DailyReports() {
  const { transactions, clearTransactions } = usePOS();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter transactions by selected date
  const filteredTransactions = transactions.filter(txn => {
    const txnDate = new Date(txn.timestamp).toISOString().split('T')[0];
    return txnDate === selectedDate;
  });

  // Calculate statistics
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const totalItems = filteredTransactions.reduce((sum, t) => 
    sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const cashTransactions = filteredTransactions.filter(t => t.paymentMethod === 'cash');
  const cardTransactions = filteredTransactions.filter(t => t.paymentMethod === 'card');
  const cashRevenue = cashTransactions.reduce((sum, t) => sum + t.total, 0);
  const cardRevenue = cardTransactions.reduce((sum, t) => sum + t.total, 0);
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Get sales by cashier
  const salesByCashier: { [key: string]: { count: number; revenue: number } } = {};
  filteredTransactions.forEach(txn => {
    if (!salesByCashier[txn.cashier]) {
      salesByCashier[txn.cashier] = { count: 0, revenue: 0 };
    }
    salesByCashier[txn.cashier].count++;
    salesByCashier[txn.cashier].revenue += txn.total;
  });

  // Get top selling products
  const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
  filteredTransactions.forEach(txn => {
    txn.items.forEach(item => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.product.id].quantity += item.quantity;
      productSales[item.product.id].revenue += item.product.price * item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10);

  // Hourly breakdown
  const hourlyBreakdown: { [key: number]: number } = {};
  filteredTransactions.forEach(txn => {
    const hour = new Date(txn.timestamp).getHours();
    hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + txn.total;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 print-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-violet-950 flex items-center gap-2">
            <IconChartBar className="h-7 w-7" />
            Daily Sales Report
          </h2>
          
          <div className="flex items-center space-x-4 print:hidden">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950"
            />
            <button
              onClick={handlePrint}
              className="bg-violet-950 text-yellow-400 px-6 py-2 rounded-lg font-semibold hover:bg-violet-900 transition-colors flex items-center gap-2"
            >
              <IconPrinter className="h-5 w-5" />
              Print Report
            </button>
            <button
              onClick={clearTransactions}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <IconTrash className="h-5 w-5" />
              Clear All
            </button>
          </div>
        </div>

        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block text-center mb-6 border-b-2 pb-4">
          <h1 className="text-3xl font-bold text-violet-950">KAPRUKA</h1>
          <p className="text-lg font-semibold mt-2">Daily Sales Report</p>
          <p className="text-sm text-gray-600 mt-1">
            Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Generated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-violet-50 rounded-lg p-4 border print:border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-violet-950">Rs. {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border print:border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-violet-950">{totalTransactions}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border print:border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Items Sold</p>
            <p className="text-2xl font-bold text-violet-950">{totalItems}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border print:border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Avg. Transaction</p>
            <p className="text-2xl font-bold text-violet-950">Rs. {averageTransaction.toFixed(2)}</p>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No transactions found for this date</p>
            <p className="text-sm">Try selecting a different date</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-violet-950 mb-4">Payment Methods</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 flex items-center gap-2">
                      <IconCash className="h-5 w-5 print:hidden" />
                      Cash
                    </span>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {cashTransactions.length} txns
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">Rs. {cashRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {totalRevenue > 0 ? ((cashRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 flex items-center gap-2">
                      <IconCreditCard className="h-5 w-5 print:hidden" />
                      Card
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {cardTransactions.length} txns
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">Rs. {cardRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {totalRevenue > 0 ? ((cardRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
            </div>

            {/* Sales by Cashier */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-violet-950 mb-4">Sales by Cashier</h3>
              <div className="space-y-3">
                {Object.entries(salesByCashier).map(([cashier, data]) => (
                  <div key={cashier} className="bg-white rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{cashier}</p>
                      <p className="text-sm text-gray-600">{data.count} transactions</p>
                    </div>
                    <p className="text-xl font-bold text-violet-950">Rs. {data.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-violet-950 mb-4">Top Selling Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-4">Rank</th>
                      <th className="text-left py-2 px-4">Product</th>
                      <th className="text-right py-2 px-4">Units Sold</th>
                      <th className="text-right py-2 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map(([id, data], index) => (
                      <tr key={id} className="border-b border-gray-200 hover:bg-white">
                        <td className="py-3 px-4 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">{data.name}</td>
                        <td className="py-3 px-4 text-right font-semibold">{data.quantity}</td>
                        <td className="py-3 px-4 text-right font-semibold">Rs. {data.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hourly Breakdown */}
            {Object.keys(hourlyBreakdown).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg text-violet-950 mb-4">Hourly Sales Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(hourlyBreakdown)
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .map(([hour, revenue]) => {
                      const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                      return (
                        <div key={hour} className="flex items-center space-x-4">
                          <span className="text-sm font-medium w-20">
                            {hour.padStart(2, '0')}:00
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                            <div
                              className="bg-violet-950 h-8 rounded-full flex items-center justify-end px-3"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            >
                              <span className="text-xs text-yellow-400 font-semibold">
                                Rs. {revenue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
