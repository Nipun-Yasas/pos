'use client';

import { useState, useRef, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import { IconBarcode } from '@tabler/icons-react';

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { products, addToCart } = usePOS();

  useEffect(() => {
    // Auto-focus the barcode input
    inputRef.current?.focus();
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode.trim()) {
      return;
    }

    // Find product by barcode
    const product = products.find(p => p.barcode === barcode.trim());

    if (product) {
      if (product.stock > 0) {
        addToCart(product);
        setMessage({ text: `Added ${product.name} to cart`, type: 'success' });
      } else {
        setMessage({ text: `${product.name} is out of stock`, type: 'error' });
      }
    } else {
      setMessage({ text: 'Product not found', type: 'error' });
    }

    setBarcode('');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-violet-950 flex items-center gap-2">
          <IconBarcode className="h-6 w-6" />
          Barcode Scanner
        </h2>
      </div>

      <form onSubmit={handleBarcodeSubmit} className="space-y-4">
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-2">
            Scan or Enter Barcode
          </label>
          <input
            ref={inputRef}
            type="text"
            id="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan barcode or type manually..."
            className="w-full px-4 py-3 border-2 border-violet-950/20 rounded-lg focus:outline-none focus:border-violet-950 focus:ring-2 focus:ring-violet-950/20 transition-all text-lg"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-violet-950 text-yellow-400 py-3 px-4 rounded-lg font-semibold hover:bg-violet-900 transition-colors"
        >
          Add to Cart
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 px-4 py-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

    </div>
  );
}
