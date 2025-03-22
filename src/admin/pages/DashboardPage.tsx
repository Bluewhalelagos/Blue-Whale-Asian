import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UtensilsCrossed, 
  CalendarDays, 
  Truck,
  TrendingUp,
  Eye,
  X,
  Clock,
  Store
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  getDoc, 
  updateDoc,
  setDoc 
} from 'firebase/firestore';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  persons: string;
  status: 'pending' | 'approved' | 'cancelled';
}

interface RestaurantStatus {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lastUpdated: string;
}

const DashboardPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    openTime: '17:00 PM',
    closeTime: '10:00 PM',
    lastUpdated: new Date().toISOString()
  });
  const [stats, setStats] = useState({
    reservations: 0,
    menuItems: 48,
    applications: 0,
    deliveries: 18
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactsQuery = query(
          collection(db, 'contacts'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsList = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Contact[];
        setContacts(contactsList);

        // Fetch reservations
        const reservationsQuery = query(
          collection(db, 'reservations'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const reservationsSnapshot = await getDocs(reservationsQuery);
        const reservationsList = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reservation[];
        setReservations(reservationsList);

        // Fetch restaurant status
        const statusDoc = await getDoc(doc(db, 'settings', 'restaurantStatus'));
        if (statusDoc.exists()) {
          setRestaurantStatus(statusDoc.data() as RestaurantStatus);
        } else {
          // Create the document if it doesn't exist
          await setDoc(doc(db, 'settings', 'restaurantStatus'), restaurantStatus);
        }

        // Update stats
        setStats(prev => ({
          ...prev,
          reservations: reservationsSnapshot.size,
          applications: contactsSnapshot.size
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleRestaurantStatus = async () => {
    setIsUpdating(true);
    try {
      const updatedStatus = {
        ...restaurantStatus,
        isOpen: !restaurantStatus.isOpen,
        lastUpdated: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'settings', 'restaurantStatus'), updatedStatus);
      
      // Update local state
      setRestaurantStatus(updatedStatus);
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateRestaurantHours = async (openTime: string, closeTime: string) => {
    setIsUpdating(true);
    try {
      const updatedStatus = {
        ...restaurantStatus,
        openTime,
        closeTime,
        lastUpdated: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateDoc(doc(db, 'settings', 'restaurantStatus'), updatedStatus);
      
      // Update local state
      setRestaurantStatus(updatedStatus);
    } catch (error) {
      console.error('Error updating restaurant hours:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Reservations', 
      value: stats.reservations.toString(), 
      icon: CalendarDays,
      change: '+12%',
      color: 'bg-blue-500'
    },
    { 
      title: 'Menu Items', 
      value: stats.menuItems.toString(), 
      icon: UtensilsCrossed,
      change: '+3%',
      color: 'bg-amber-500'
    },
    { 
      title: 'Contact Messages', 
      value: stats.applications.toString(), 
      icon: Users,
      change: '+5%',
      color: 'bg-green-500'
    },
    { 
      title: 'Active Deliveries', 
      value: stats.deliveries.toString(), 
      icon: Truck,
      change: '+8%',
      color: 'bg-purple-500'
    }
  ];

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Status Control */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Restaurant Status
          </h2>
          <span className="text-sm text-gray-500">
            Last updated: {new Date(restaurantStatus.lastUpdated).toLocaleString()}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
              restaurantStatus.isOpen 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-gradient-to-r from-red-400 to-red-600'
            } mr-4`}>
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold">
                {restaurantStatus.isOpen ? 'Restaurant is Open' : 'Restaurant is Closed'}
              </p>
              <p className="text-sm text-gray-600">
                Hours: {restaurantStatus.openTime} - {restaurantStatus.closeTime}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex space-x-2 w-full md:w-auto">
              <input 
                type="time" 
                className="rounded border border-gray-300 px-2 py-1"
                value={restaurantStatus.openTime.split(' ')[0]}
                onChange={(e) => {
                  const newTime = e.target.value + ' PM';
                  updateRestaurantHours(newTime, restaurantStatus.closeTime);
                }}
              />
              <span className="self-center">-</span>
              <input 
                type="time" 
                className="rounded border border-gray-300 px-2 py-1"
                value={restaurantStatus.closeTime.split(' ')[0]}
                onChange={(e) => {
                  const newTime = e.target.value + ' PM';
                  updateRestaurantHours(restaurantStatus.openTime, newTime);
                }}
              />
            </div>
            
            <button
              onClick={toggleRestaurantStatus}
              disabled={isUpdating}
              className={`${
                restaurantStatus.isOpen 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white py-2 px-4 rounded-lg transition-colors duration-200 min-w-32`}
            >
              {isUpdating ? 'Updating...' : restaurantStatus.isOpen ? 'Mark as Closed' : 'Mark as Open'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">{stat.change}</span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Messages */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(contact.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Reservations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(reservation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.persons}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h3>
                <p className="text-gray-600">{selectedContact.email}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Received: {new Date(selectedContact.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;