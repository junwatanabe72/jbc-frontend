import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

interface NavItem {
  name: string;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { name: 'ダッシュボード', href: '/dashboard', roles: ['OWNER', 'MGMT', 'TENANT', 'BROKER'] },
  { name: 'カレンダー', href: '/calendar', roles: ['OWNER', 'MGMT', 'TENANT'] },
  // ビル管理
  { name: 'ビル管理', href: '/building-management', roles: ['OWNER', 'MGMT'] },
  { name: '請求書管理', href: '/billing', roles: ['OWNER', 'MGMT'] },
  { name: 'レポート・分析', href: '/analytics', roles: ['OWNER', 'MGMT'] },
  // 会議室予約フロー（独立）
  { name: '会議室予約', href: '/bookings', roles: ['TENANT'] },
  { name: '予約管理', href: '/booking-management', roles: ['OWNER', 'MGMT'] },
  // 各種申請フロー（独立）
  { name: '各種申請', href: '/apply', roles: ['TENANT'] },
  { name: '申請受付・承認', href: '/requests', roles: ['OWNER', 'MGMT'] },
  // その他
  { name: '空室情報', href: '/vacancies', roles: ['BROKER'] },
  { name: '緊急連絡', href: '/emergency', roles: ['OWNER', 'MGMT', 'TENANT'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const availableItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <nav className="bg-gray-800 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {availableItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;