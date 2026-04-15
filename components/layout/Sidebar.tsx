// Sidebar navigation component
// Validates: Requirements 14.1, 14.2

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ChefHat, Brain, Users } from 'lucide-react';

const navItems = [
  { href: '/command-center', label: 'Command Center', icon: LayoutDashboard },
  { href: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { href: '/ai-hub', label: 'AI Hub', icon: Brain },
  { href: '/staff', label: 'Staff Dispatch', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-lime-400">KitchenOS</h1>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-lime-400 text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
