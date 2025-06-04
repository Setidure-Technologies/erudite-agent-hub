
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { 
  Home, 
  User, 
  Upload, 
  Settings,
  BarChart3, 
  Briefcase, 
  Target,
  Menu,
  X,
  LogOut,
  Shield,
  BookOpen,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole, accessibleAgents, hasAccess } = useRoleAccess();

  const getNavigationItems = () => {
    const baseNavigation = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Profile', href: '/profile', icon: User },
    ];

    const roleSpecificItems = [];

    if (userRole?.name === 'admin') {
      roleSpecificItems.push(
        { name: 'Admin Dashboard', href: '/admin-dashboard', icon: Shield },
        { name: 'Admin Panel', href: '/admin', icon: Settings },
        { name: 'Teacher View', href: '/teacher-dashboard', icon: BookOpen },
        { name: 'Student View', href: '/student-dashboard', icon: Users },
      );
    } else if (userRole?.name === 'teacher') {
      roleSpecificItems.push(
        { name: 'Teacher Dashboard', href: '/teacher-dashboard', icon: BookOpen },
      );
    } else if (userRole?.name === 'student') {
      roleSpecificItems.push(
        { name: 'Student Dashboard', href: '/student-dashboard', icon: Users },
      );
    }

    // Add accessible agent routes
    const agentItems = accessibleAgents.map(agent => {
      const iconMap: Record<string, any> = {
        'Upload': Upload,
        'BarChart3': BarChart3,
        'Briefcase': Briefcase,
        'Target': Target,
      };
      
      return {
        name: agent.name,
        href: agent.route,
        icon: iconMap[agent.icon] || Settings
      };
    });

    return [...baseNavigation, ...roleSpecificItems, ...agentItems];
  };

  const navigation = getNavigationItems();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Upadhyai</h1>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="text-sm text-gray-600">
              {user?.email}
            </div>
            {userRole && (
              <div className="text-xs text-blue-600 font-medium">
                {userRole.name.charAt(0).toUpperCase() + userRole.name.slice(1)}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export { Sidebar };
