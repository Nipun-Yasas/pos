'use client';

import { usePOS } from '../context/POSContext';
import { IconShoppingBag } from '@tabler/icons-react';

interface ShoppingCartProps {
  onCheckout: () => void;
}

export default function ShoppingCart({ onCheckout }: ShoppingCartProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartSubtotal, getCartTax, getCartTotal } = usePOS();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-violet-950 flex items-center gap-2">
          <IconShoppingBag className="h-6 w-6" />
          Shopping Cart
        </h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Cart is empty</p>
            <p className="text-sm">Scan or add products to start</p>
          </div>
        ) : (
          cart.map(item => (
            <div
              key={item.product.id}
              className="border-2 border-gray-200 rounded-lg p-3 hover:border-violet-950/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Rs. {item.product.price.toFixed(2)} each</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Remove item"
                >
                  ❌
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span className="text-lg font-bold text-violet-950">
                  Rs. {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-semibold">Rs. {getCartSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (10%):</span>
            <span className="font-semibold">Rs. {getCartTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-violet-950 pt-2 border-t-2 border-gray-200">
            <span>Total:</span>
            <span>Rs. {getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-violet-950 text-yellow-400 py-4 px-4 rounded-lg font-bold text-lg hover:bg-violet-900 transition-colors mt-4"
          >
            Proceed to Checkout 
          </button>
        </div>
      )}
    </div>
  );
}
