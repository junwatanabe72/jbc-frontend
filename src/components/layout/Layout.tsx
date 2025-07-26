import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        {/* デスクトップサイドバー */}
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar isMobile={false} onClose={() => {}} />
        </div>
        
        {/* モバイルサイドバー */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-40 flex">
              {/* オーバーレイ */}
              <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75" 
                onClick={toggleMobileMenu}
              ></div>
              
              {/* サイドバー */}
              <div className="relative flex-1 flex flex-col max-w-xs w-full">
                <Sidebar isMobile={true} onClose={toggleMobileMenu} />
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 min-w-0 p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
};

export default Layout;