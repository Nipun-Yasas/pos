'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Transaction } from '../types';
import { IconClipboardList, IconTrash } from '@tabler/icons-react';

export default function TransactionHistory() {
  const { transactions, currentCashier, clearTransactions } = usePOS();
  const [filterCashier, setFilterCashier] = useState<'all' | 'me'>('me');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    if (filterCashier === 'me') {
      return txn.cashier === currentCashier?.username;
    }
    return true;
  });

  // Get unique cashiers
  const uniqueCashiers = Array.from(new Set(transactions.map(t => t.cashier)));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-violet-950 flex items-center gap-2">
            <IconClipboardList className="h-7 w-7" />
            Transaction History
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterCashier('me')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCashier === 'me'
                  ? 'bg-violet-950 text-yellow-400'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              My Transactions
            </button>
            <button
              onClick={() => setFilterCashier('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCashier === 'all'
                  ? 'bg-violet-950 text-yellow-400'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={clearTransactions}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <IconTrash className="h-5 w-5" />
              Clear All
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-violet-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-violet-950">{filteredTransactions.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-violet-950">
              Rs. {filteredTransactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Items Sold</p>
            <p className="text-2xl font-bold text-violet-950">
              {filteredTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
            </p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No transactions found</p>
              <p className="text-sm">Transactions will appear here once you complete sales</p>
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-violet-950 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-violet-950">Transaction #{transaction.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Cashier: {transaction.cashier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-violet-950">Rs. {transaction.total.toFixed(2)}</p>
                    <p className={`text-xs px-2 py-1 rounded inline-block ${
                      transaction.paymentMethod === 'cash' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {transaction.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {transaction.items.length} item(s) • 
                  {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} units
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-violet-950">Transaction Details</h3>
                <p className="text-sm text-gray-600">{selectedTransaction.id}</p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-semibold">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cashier</p>
                    <p className="font-semibold">{selectedTransaction.cashier}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-semibold uppercase">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Items</p>
                    <p className="font-semibold">
                      {selectedTransaction.items.reduce((sum, item) => sum + item.quantity, 0)} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items Purchased</h4>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Rs. {item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        Rs. {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-violet-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs. {selectedTransaction.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span className="font-semibold">Rs. {selectedTransaction.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-violet-950 pt-2 border-t-2 border-violet-200">
                    <span>Total:</span>
                    <span>Rs. {selectedTransaction.total.toFixed(2)}</span>
                  </div>
                  {selectedTransaction.paymentMethod === 'cash' && (
                    <>
                      <div className="flex justify-between text-sm pt-2 border-t border-violet-200">
                        <span>Amount Paid:</span>
                        <span>Rs. {selectedTransaction.amountPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-green-600">
                        <span>Change:</span>
                        <span>Rs. {selectedTransaction.change.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
