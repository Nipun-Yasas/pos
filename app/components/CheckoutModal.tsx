'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Transaction } from '../types';
import { IconCreditCard, IconPrinter, IconCash } from '@tabler/icons-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, currentCashier, getCartSubtotal, getCartTax, getCartTotal, addTransaction, clearCart, updateProduct, products } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const total = getCartTotal();
  const change = paymentMethod === 'cash' ? Math.max(0, parseFloat(amountPaid || '0') - total) : 0;
  const canComplete = paymentMethod === 'card' || (paymentMethod === 'cash' && parseFloat(amountPaid || '0') >= total);

  const handleCompleteTransaction = () => {
    if (!canComplete || !currentCashier) return;

    // Create transaction
    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      cashier: currentCashier.username,
      items: cart,
      subtotal: getCartSubtotal(),
      tax: getCartTax(),
      total: total,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? parseFloat(amountPaid) : total,
      change: change,
      timestamp: new Date(),
    };

    // Update product stock
    cart.forEach(item => {
      const product = products.find(p => p.id === item.product.id);
      if (product) {
        updateProduct({
          ...product,
          stock: product.stock - item.quantity,
        });
      }
    });

    // Save transaction
    addTransaction(transaction);
    setLastTransaction(transaction);
    setShowReceipt(true);
  };

  const handleClose = () => {
    if (showReceipt) {
      clearCart();
      setShowReceipt(false);
      setLastTransaction(null);
      setAmountPaid('');
    }
    onClose();
  };

  const printReceipt = () => {
    window.print();
  };

  if (showReceipt && lastTransaction) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          {/* Receipt */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-violet-950">KAPRUKA</h2>
            <p className="text-sm text-gray-600">Point of Sale</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(lastTransaction.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4 mb-4">
            <div className="space-y-2">
              {lastTransaction.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {lastTransaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>Rs. {lastTransaction.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
              <span>Total:</span>
              <span>Rs. {lastTransaction.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-200">
              <span>Payment Method:</span>
              <span className="uppercase">{lastTransaction.paymentMethod}</span>
            </div>
            {lastTransaction.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Amount Paid:</span>
                  <span>Rs. {lastTransaction.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Change:</span>
                  <span>Rs. {lastTransaction.change.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 mb-6 border-t pt-4">
            <p>Transaction ID: {lastTransaction.id}</p>
            <p>Cashier: {currentCashier?.name}</p>
            <p className="mt-2">Thank you for shopping with us!</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={printReceipt}
              className="flex-1 bg-violet-950 text-yellow-400 py-3 px-4 rounded-lg font-semibold hover:bg-violet-900 transition-colors flex items-center justify-center gap-2"
            >
              <IconPrinter className="h-5 w-5" />
              Print Receipt
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-violet-950 mb-6 flex items-center gap-2">
          <IconCreditCard className="h-6 w-6" />
          Checkout
        </h2>

        {/* Order Summary */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.product.name} x{item.quantity}</span>
                <span>Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {getCartSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>Rs. {getCartTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors flex items-center justify-center gap-2 ${
                paymentMethod === 'cash'
                  ? 'border-violet-950 bg-violet-950 text-yellow-400'
                  : 'border-gray-300 text-gray-700 hover:border-violet-950'
              }`}
            >
              <IconCash className="h-5 w-5" />
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors flex items-center justify-center gap-2 ${
                paymentMethod === 'card'
                  ? 'border-violet-950 bg-violet-950 text-yellow-400'
                  : 'border-gray-300 text-gray-700 hover:border-violet-950'
              }`}
            >
              <IconCreditCard className="h-5 w-5" />
              Card
            </button>
          </div>
        </div>

        {/* Cash Payment Input */}
        {paymentMethod === 'cash' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Received
            </label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min={total}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950 focus:ring-2 focus:ring-violet-950/20 text-lg"
            />
            {amountPaid && parseFloat(amountPaid) >= total && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Change:</span>
                  <span>Rs. {change.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCompleteTransaction}
            disabled={!canComplete}
            className="flex-1 bg-violet-950 text-yellow-400 py-3 px-4 rounded-lg font-semibold hover:bg-violet-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
