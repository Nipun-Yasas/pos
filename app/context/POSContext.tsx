'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Transaction, Cashier, User } from '../types';
import { initialProducts } from '../data/products';

interface POSContextType {
  // Authentication
  currentCashier: Cashier | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // User Management
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (userId: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
  
  // Calculations
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

// Initial admin user
const initialUsers: User[] = [
  {
    id: 'admin001',
    username: 'admin',
    password: 'admin1234',
    name: 'Administrator',
    role: 'admin',
    createdAt: new Date(),
  }
];

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [currentCashier, setCurrentCashier] = useState<Cashier | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('pos_users');
    const savedProducts = localStorage.getItem('pos_products');
    const savedTransactions = localStorage.getItem('pos_transactions');
    const savedCashier = localStorage.getItem('pos_cashier');

    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
    setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
    if (savedCashier) {
      setCurrentCashier(JSON.parse(savedCashier));
    }
  }, []);

  // Save users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('pos_users', JSON.stringify(users));
    }
  }, [users]);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('pos_products', JSON.stringify(products));
    }
  }, [products]);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('pos_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Save cashier to localStorage
  useEffect(() => {
    if (currentCashier) {
      localStorage.setItem('pos_cashier', JSON.stringify(currentCashier));
    } else {
      localStorage.removeItem('pos_cashier');
    }
  }, [currentCashier]);

  // Authentication
  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentCashier({
        username: user.username,
        name: user.name,
        role: user.role,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentCashier(null);
    setCart([]);
  };

  // User Management
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `USR${Date.now()}`,
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (userId: string) => {
    // Prevent deleting the admin user
    if (userId === 'admin001') return;
    setUsers(users.filter(u => u.id !== userId));
  };

  // Product management
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  // Cart management
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Transaction management
  const addTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const clearTransactions = () => {
    if (confirm('Are you sure you want to delete all transaction records? This action cannot be undone.')) {
      setTransactions([]);
      localStorage.setItem('pos_transactions', JSON.stringify([]));
      alert('All transaction records have been cleared successfully.');
    }
  };

  // Calculations (10% tax)
  const TAX_RATE = 0.10;

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartTax = () => {
    return getCartSubtotal() * TAX_RATE;
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getCartTax();
  };

  return (
    <POSContext.Provider
      value={{
        currentCashier,
        login,
        logout,
        users,
        addUser,
        deleteUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        transactions,
        addTransaction,
        clearTransactions,
        getCartTotal,
        getCartSubtotal,
        getCartTax,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
