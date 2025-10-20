// Product types
export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Transaction types
export interface Transaction {
  id: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  amountPaid: number;
  change: number;
  timestamp: Date;
}

// User type
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'cashier';
  createdAt: Date;
}

// Cashier type (for current session)
export interface Cashier {
  username: string;
  name: string;
  role: 'admin' | 'cashier';
}

// Category type
export type Category = 'All' | 'Electronics' | 'Groceries' | 'Beverages' | 'Snacks' | 'Household' | 'Personal Care' | 'Other';
