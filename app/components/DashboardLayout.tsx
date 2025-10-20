'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Sidebar, SidebarBody, SidebarLink } from './SideBar';
import {
  IconShoppingCart,
  IconHistory,
  IconChartBar,
  IconPackage,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { motion } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'pos' | 'history' | 'reports' | 'products' | 'users';
  onTabChange: (tab: 'pos' | 'history' | 'reports' | 'products' | 'users') => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { currentCashier, logout } = usePOS();
  const [open, setOpen] = useState(false);

  const baseLinks = [
    {
      label: 'Point of Sale',
      href: '#',
      IconComponent: IconShoppingCart,
      id: 'pos' as const,
    },
    {
      label: 'Transaction History',
      href: '#',
      IconComponent: IconHistory,
      id: 'history' as const,
    },
    {
      label: 'Daily Reports',
      href: '#',
      IconComponent: IconChartBar,
      id: 'reports' as const,
    },
    {
      label: 'Product Management',
      href: '#',
      IconComponent: IconPackage,
      id: 'products' as const,
    },
  ];

  // Add User Management link only for admin
  const links = currentCashier?.role === 'admin' 
    ? [
        ...baseLinks,
        {
          label: 'User Management',
          href: '#',
          IconComponent: IconUsers,
          id: 'users' as const,
        },
      ]
    : baseLinks;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <div className="print:hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-violet-700">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => {
                const IconComponent = link.IconComponent;
                const isActive = activeTab === link.id;
                
                return (
                  <div
                    key={idx}
                    onClick={() => onTabChange(link.id)}
                    className={`flex items-center justify-start gap-2 group/SideBar py-2 cursor-pointer rounded-md px-2 transition-colors
                      ${isActive
                        ? "bg-yellow-400 text-violet-950"
                        : "text-yellow-400 hover:bg-violet-900"}
                    `}
                  >
                    <IconComponent 
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? "text-violet-950" : "text-yellow-400"
                      }`}
                    />
                    <motion.span
                      animate={{
                        display: open ? "inline-block" : "none",
                        opacity: open ? 1 : 0,
                      }}
                      className={`text-sm group-hover/SideBar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 ${
                        isActive ? "text-violet-950 font-semibold" : "text-yellow-400"
                      }`}
                    >
                      {link.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div
              onClick={logout}
              className="flex items-center justify-start gap-2 group/SideBar py-2 cursor-pointer text-yellow-400 hover:bg-violet-900 rounded-md px-2 transition-colors"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-yellow-400" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-sm group-hover/SideBar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-yellow-400"
              >
                Logout
              </motion.span>
            </div>
            <div className="mt-4 border-t border-yellow-400/20 pt-4">
              <div className="flex items-center justify-start gap-2 py-2 px-2">
                <div className="h-7 w-7 shrink-0 rounded-full bg-yellow-400 flex items-center justify-center text-violet-950 font-bold">
                  {currentCashier?.name.charAt(0).toUpperCase()}
                </div>
                <motion.div
                  animate={{
                    display: open ? "block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-yellow-400"
                >
                  <p className="text-sm font-semibold">{currentCashier?.name}</p>
                  <p className="text-xs text-yellow-400/70">{currentCashier?.username}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      </div>
      <main className="flex-1 overflow-auto p-6 print:p-0 print:w-full">
        {children}
      </main>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <img 
        src="/logo.jpeg" 
        alt="Kapruka Logo" 
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-xl whitespace-pre text-yellow-400"
      >
        KAPRUKA
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <img 
        src="/logo.jpeg" 
        alt="Kapruka Logo" 
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
    </div>
  );
};
