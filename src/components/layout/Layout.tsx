import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;