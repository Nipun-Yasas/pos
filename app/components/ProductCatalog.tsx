'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Category } from '../types';
import { IconPackage } from '@tabler/icons-react';

export default function ProductCatalog() {
  const { products, addToCart } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Electronics', 'Groceries', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'Other'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-violet-950 mb-4 flex items-center gap-2">
        <IconPackage className="h-6 w-6" />
        Product Catalog
      </h2>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Search products by name or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-violet-950/20 rounded-lg focus:outline-none focus:border-violet-950 focus:ring-2 focus:ring-violet-950/20"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-violet-950 text-yellow-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-violet-950 transition-colors cursor-pointer"
            onClick={() => addToCart(product)}
          >
            <div className="text-4xl text-center mb-2">{product.image}</div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2">Code: {product.barcode}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-violet-950">Rs. {product.price.toFixed(2)}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                product.stock > 10 
                  ? 'bg-green-100 text-green-700' 
                  : product.stock > 0 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
