import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const Layout = ({ children, role, userName }) => {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
          <Header role={role} userName={userName} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
