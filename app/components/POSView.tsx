'use client';

import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import CheckoutModal from './CheckoutModal';

export default function POSView() {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Barcode Scanner and Products */}
        <div className="lg:col-span-2 space-y-6">
          <BarcodeScanner />
          <ProductCatalog />
        </div>

        {/* Right Column - Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ShoppingCart onCheckout={() => setShowCheckout(true)} />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
}
