import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import logoImage from '../../BlueWhale-Final-logo1.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: CalendarDays, label: 'Reservations', path: '/admin/reservations' },
    { icon: Users, label: 'Careers', path: '/admin/careers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => location.pathname === item.path);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-black to-blue-800 text-white shadow-lg">
        <div className="p-4 flex justify-center border-b border-blue-700">
          <div className="flex flex-col items-center">
            <img src={logoImage} alt="Blue Whale Asian Fusion Logo" className="w-50 h-auto" />
            <span className="text-lg font-bold text-yellow-400 mt-2">Admin Portal</span>
          </div>
        </div>
        <nav className="mt-6 px-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-3 w-full px-4 py-3 mb-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-6 bg-yellow-400 ml-auto rounded-full"></div>}
              </button>
            );
          })}
          <div className="border-t border-blue-700 my-6"></div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
        <div className="absolute bottom-4 w-64 px-4 text-center text-xs text-blue-200 opacity-75">
          BLUE WHALE ASIAN FUSION
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-900">{getCurrentPageTitle()}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 px-6 py-2 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Blue Whale Asian Fusion Restaurant
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;