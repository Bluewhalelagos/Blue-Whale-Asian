import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import logoImage from '../../BlueWhale-Final-logo1.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    // Close sidebar when changing routes on mobile
    setSidebarOpen(false);

    return () => unsubscribe();
  }, [navigate, location.pathname]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-2 p-1 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-blue-900">{getCurrentPageTitle()}</h1>
          </div>
          <span className="text-sm text-gray-500">Admin</span>
        </div>
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <div className={`md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={toggleSidebar}></div>

      <div className={`fixed md:relative md:flex h-full z-30 transition-transform duration-300 ease-in-out transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } w-64 bg-gradient-to-b from-black to-blue-800 text-white shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            <div className="flex flex-col items-center w-full">
              <img src={logoImage} alt="Blue Whale Asian Fusion Logo" className="w-32 h-auto" />
              <span className="text-lg font-bold text-yellow-400 mt-2">Admin Portal</span>
            </div>
            <button onClick={toggleSidebar} className="md:hidden p-1 text-blue-100 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6 px-2 flex-grow overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
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
          <div className="p-4 text-center text-xs text-blue-200 opacity-75">
            BLUE WHALE ASIAN FUSION
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-900">{getCurrentPageTitle()}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 px-4 md:px-6 py-2 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Blue Whale Asian Fusion Restaurant
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;