import { Product } from '../types';

export const initialProducts: Product[] = [
  // Electronics
  { id: '1', barcode: '8901234567890', name: 'Wireless Mouse', category: 'Electronics', price: 1500, stock: 50, image: '🖱️' },
  { id: '2', barcode: '8901234567891', name: 'USB Cable', category: 'Electronics', price: 500, stock: 100, image: '🔌' },
  { id: '3', barcode: '8901234567892', name: 'Keyboard', category: 'Electronics', price: 2500, stock: 30, image: '⌨️' },
  { id: '4', barcode: '8901234567893', name: 'Headphones', category: 'Electronics', price: 3500, stock: 25, image: '🎧' },
  
  // Groceries
  { id: '5', barcode: '8901234567894', name: 'Rice 1kg', category: 'Groceries', price: 250, stock: 200, image: '🌾' },
  { id: '6', barcode: '8901234567895', name: 'Sugar 1kg', category: 'Groceries', price: 180, stock: 150, image: '🍬' },
  { id: '7', barcode: '8901234567896', name: 'Flour 1kg', category: 'Groceries', price: 200, stock: 100, image: '🌾' },
  { id: '8', barcode: '8901234567897', name: 'Cooking Oil 1L', category: 'Groceries', price: 450, stock: 80, image: '🛢️' },
  
  // Beverages
  { id: '9', barcode: '8901234567898', name: 'Coca Cola 500ml', category: 'Beverages', price: 150, stock: 300, image: '🥤' },
  { id: '10', barcode: '8901234567899', name: 'Mineral Water 1L', category: 'Beverages', price: 100, stock: 250, image: '💧' },
  { id: '11', barcode: '8901234567800', name: 'Orange Juice 1L', category: 'Beverages', price: 350, stock: 100, image: '🧃' },
  { id: '12', barcode: '8901234567801', name: 'Tea Packet', category: 'Beverages', price: 280, stock: 120, image: '🍵' },
  
  // Snacks
  { id: '13', barcode: '8901234567802', name: 'Potato Chips', category: 'Snacks', price: 120, stock: 200, image: '🥔' },
  { id: '14', barcode: '8901234567803', name: 'Chocolate Bar', category: 'Snacks', price: 150, stock: 150, image: '🍫' },
  { id: '15', barcode: '8901234567804', name: 'Biscuits Pack', category: 'Snacks', price: 200, stock: 180, image: '🍪' },
  { id: '16', barcode: '8901234567805', name: 'Nuts Mix', category: 'Snacks', price: 450, stock: 80, image: '🥜' },
  
  // Household
  { id: '17', barcode: '8901234567806', name: 'Laundry Detergent', category: 'Household', price: 650, stock: 100, image: '🧴' },
  { id: '18', barcode: '8901234567807', name: 'Toilet Paper 4pk', category: 'Household', price: 380, stock: 150, image: '🧻' },
  { id: '19', barcode: '8901234567808', name: 'Dish Soap', category: 'Household', price: 280, stock: 120, image: '🧽' },
  { id: '20', barcode: '8901234567809', name: 'Garbage Bags', category: 'Household', price: 320, stock: 90, image: '🗑️' },
  
  // Personal Care
  { id: '21', barcode: '8901234567810', name: 'Shampoo 400ml', category: 'Personal Care', price: 550, stock: 80, image: '🧴' },
  { id: '22', barcode: '8901234567811', name: 'Toothpaste', category: 'Personal Care', price: 250, stock: 150, image: '🦷' },
  { id: '23', barcode: '8901234567812', name: 'Soap Bar', category: 'Personal Care', price: 120, stock: 200, image: '🧼' },
  { id: '24', barcode: '8901234567813', name: 'Hand Sanitizer', category: 'Personal Care', price: 350, stock: 100, image: '🧴' },
];
