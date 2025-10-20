'use client';

import { usePOS } from './context/POSContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { currentCashier } = usePOS();

  return currentCashier ? <Dashboard /> : <LoginForm />;
}
