'use client';

import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import POSView from './POSView';
import TransactionHistory from './TransactionHistory';
import DailyReports from './DailyReports';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'reports' | 'products' | 'users'>('pos');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'pos' && <POSView />}
      {activeTab === 'history' && <TransactionHistory />}
      {activeTab === 'reports' && <DailyReports />}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'users' && <UserManagement />}
    </DashboardLayout>
  );
}
