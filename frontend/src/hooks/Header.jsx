import React from 'react';
import { Bell, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const Header = ({ role, userName }) => {
  const getRoleDisplay = () => {
    switch (role) {
      case 'patient':
        return 'Patient Portal';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-30">
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {getRoleDisplay()}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, <span className="font-medium text-foreground">{userName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[hsl(4,75%,48%)]">
                3
              </Badge>
            </button>

            <div className="hidden md:flex items-center gap-3 px-4 py-2 glass-card rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[hsl(205,70%,40%)] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
