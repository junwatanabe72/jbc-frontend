import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import type { UserRole } from "../../types";

interface SidebarProps {
  isMobile: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    name: "ダッシュボード",
    href: "/dashboard",
    roles: ["OWNER", "MGMT", "TENANT", "BROKER"],
  },

  // オーナー専用
  { name: "イベントカレンダー", href: "/calendar", roles: ["OWNER"] },
  { name: "受付・承認", href: "/requests", roles: ["OWNER"] },
  { name: "運用状況確認", href: "/analytics", roles: ["OWNER"] },
  { name: "緊急連絡", href: "/emergency", roles: ["OWNER"] },

  // 管理会社専用
  { name: "イベントカレンダー", href: "/calendar", roles: ["MGMT"] },
  { name: "業務報告", href: "/reports", roles: ["MGMT"] },
  { name: "請求等", href: "/billing", roles: ["MGMT"] },
  { name: "緊急連絡", href: "/emergency", roles: ["MGMT"] },

  // テナント専用
  { name: "イベントカレンダー", href: "/calendar", roles: ["TENANT"] },
  { name: "手続き・予約", href: "/apply", roles: ["TENANT"] },
  { name: "館内細則", href: "/rules", roles: ["TENANT"] },
  { name: "緊急連絡", href: "/emergency", roles: ["TENANT"] },

  // 仲介会社専用
  { name: "空室情報確認", href: "/vacancies", roles: ["BROKER"] },
  { name: "図面ダウンロード", href: "/downloads", roles: ["BROKER"] },
  { name: "契約書・館内細則", href: "/contracts", roles: ["BROKER"] },
  { name: "緊急連絡", href: "/emergency", roles: ["BROKER"] },
];

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onClose }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const availableItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <nav className={`bg-gray-800 ${
      isMobile 
        ? 'w-64 h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out'
        : 'w-64 min-h-screen'
    }`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">JBC Building Cloud</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="メニューを閉じる"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="p-4">
        <ul className="space-y-2">
          {availableItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
  )
};

export default Sidebar;
