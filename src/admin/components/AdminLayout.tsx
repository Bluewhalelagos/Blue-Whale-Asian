import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UtensilsCrossed, 
  Users, 
  Truck, 
  Settings,
  LogOut
} from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const AdminLayout = () => {
  const navigate = useNavigate();
  
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
    { icon: UtensilsCrossed, label: 'Menu', path: '/admin/menu' },
    { icon: Users, label: 'Careers', path: '/admin/careers' },
    { icon: Truck, label: 'Delivery', path: '/admin/delivery' },
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <UtensilsCrossed className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold">Blue Whale Admin</span>
          </div>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-2 w-full px-6 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-6 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;