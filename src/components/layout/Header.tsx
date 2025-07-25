import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import NotificationBell from '../common/NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'OWNER': return 'オーナー';
      case 'MGMT': return '管理会社';
      case 'TENANT': return 'テナント';
      case 'BROKER': return '仲介会社';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              JBC Building Cloud
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <span className="text-sm text-gray-700">
              {user?.name} ({getRoleDisplayName(user?.role || '')})
            </span>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;