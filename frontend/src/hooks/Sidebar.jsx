import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, Home, LogOut, Menu, X, Users } from 'lucide-react';
import { logout } from '../auth';
import { Button } from '../components/ui/button';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    switch (role) {
      case 'patient':
        return [
          { path: '/patient', icon: Home, label: 'Dashboard' },
        ];
      case 'doctor':
        return [
          { path: '/doctor', icon: BarChart3, label: 'Analytics' },
        ];
      case 'admin':
        return [
          { path: '/admin', icon: Users, label: 'Admin Panel' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-[hsl(205,70%,40%)]" />
          <div>
            <h2 className="text-xl font-bold text-foreground">MedFlow</h2>
            <p className="text-xs text-muted-foreground">OPD Prediction</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[hsl(205,70%,40%)] text-white shadow-md'
                  : 'text-foreground hover:bg-white/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-card transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
