import React, { useState, useEffect } from 'react';
import {
  Users,
  UtensilsCrossed,
  CalendarDays,
  Truck,
  TrendingUp,
  Eye,
  X,
  Store,
  ChefHat,
  Tag,
  Save,
  Trash2
} from 'lucide-react';
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
  setDoc,
  deleteDoc
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
  lastUpdated: string;
}

interface TodaysSpecial {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
}

interface Offer {
  id?: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
  showOnLoad: boolean;
}

const DashboardPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    lastUpdated: new Date().toISOString()
  });
  const [stats, setStats] = useState({
    reservations: 0,
    menuItems: 48,
    applications: 0,
    deliveries: 18
  });
  const [todaysSpecial, setTodaysSpecial] = useState<TodaysSpecial[]>([]);
  const [newTodaysSpecial, setNewTodaysSpecial] = useState<TodaysSpecial>({
    name: '',
    description: '',
    price: 0,
    image: '',
    isActive: false
  });
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newOffer, setNewOffer] = useState<Offer>({
    title: '',
    description: '',
    discountPercentage: 0,
    validUntil: new Date().toISOString().split('T')[0],
    isActive: true,
    showOnLoad: true
  });
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);

  const addNewTodaysSpecial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const specialRef = doc(collection(db, 'specials'));
      const specialWithId = { ...newTodaysSpecial, id: specialRef.id };
      await setDoc(specialRef, specialWithId);
      setTodaysSpecial([...todaysSpecial, specialWithId]);
      alert("Today's Special added successfully!");
      setNewTodaysSpecial({
        name: '',
        description: '',
        price: 0,
        image: '',
        isActive: false
      });
    } catch (error) {
      console.error('Error adding today\'s special:', error);
      alert('Failed to add Today\'s Special');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeTodaysSpecial = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this special?')) return;
    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, 'specials', id));
      setTodaysSpecial(todaysSpecial.filter(special => special.id !== id));
      alert('Special removed successfully!');
    } catch (error) {
      console.error('Error removing special:', error);
      alert('Failed to remove special');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSpecialStatus = async (id: string) => {
    const special = todaysSpecial.find(s => s.id === id);
    if (!special) return;
    setIsUpdating(true);
    try {
      const updatedSpecial = { ...special, isActive: !special.isActive };
      await updateDoc(doc(db, 'specials', id), updatedSpecial);
      setTodaysSpecial(todaysSpecial.map(s => s.id === id ? updatedSpecial : s));
    } catch (error) {
      console.error('Error updating special status:', error);
      alert('Failed to update special status');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const statusDoc = await getDoc(doc(db, 'settings', 'restaurantStatus'));
        if (statusDoc.exists()) {
          setRestaurantStatus(statusDoc.data() as RestaurantStatus);
        }

        const specialsSnapshot = await getDocs(collection(db, 'specials'));
        const specialsList = specialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TodaysSpecial[];
        setTodaysSpecial(specialsList);

        const offersQuery = query(collection(db, 'offers'));
        const offersSnapshot = await getDocs(offersQuery);
        const offersList = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        setOffers(offersList);

        setStats(prev => ({
          ...prev,
          reservations: reservationsSnapshot.size,
          applications: contactsSnapshot.size
        }));

        const upcomingDates = reservationsList.reduce((acc: { [key: string]: number }, reservation) => {
          const date = new Date(reservation.date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const sortedDates = Object.entries(upcomingDates)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .slice(0, 4)
          .map(([date, count]) => ({ date, count }));
        setUpcomingReservations(sortedDates);
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
      await updateDoc(doc(db, 'settings', 'restaurantStatus'), updatedStatus);
      setRestaurantStatus(updatedStatus);
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addNewOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const offerRef = doc(collection(db, 'offers'));
      const offerWithId = { ...newOffer, id: offerRef.id };
      await setDoc(offerRef, offerWithId);
      setOffers([...offers, offerWithId]);
      setNewOffer({
        title: '',
        description: '',
        discountPercentage: 0,
        validUntil: new Date().toISOString().split('T')[0],
        isActive: true,
        showOnLoad: true
      });
      alert('New offer added successfully!');
    } catch (error) {
      console.error('Error adding new offer:', error);
      alert('Failed to add new offer');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeOffer = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this offer?')) return;
    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, 'offers', id));
      setOffers(offers.filter(offer => offer.id !== id));
      alert('Offer removed successfully!');
    } catch (error) {
      console.error('Error removing offer:', error);
      alert('Failed to remove offer');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleOfferStatus = async (offerId: string) => {
    const offerToUpdate = offers.find(o => o.id === offerId);
    if (!offerToUpdate) return;
    try {
      const updatedOffer = { ...offerToUpdate, isActive: !offerToUpdate.isActive };
      await updateDoc(doc(db, 'offers', offerId), updatedOffer);
      setOffers(offers.map(o => o.id === offerId ? updatedOffer : o));
    } catch (error) {
      console.error('Error toggling offer status:', error);
      alert('Failed to update offer status');
    }
  };

  const toggleOfferShowOnLoad = async (offerId: string) => {
    const offerToUpdate = offers.find(o => o.id === offerId);
    if (!offerToUpdate) return;
    try {
      const updatedOffer = { ...offerToUpdate, showOnLoad: !offerToUpdate.showOnLoad };
      await updateDoc(doc(db, 'offers', offerId), updatedOffer);
      setOffers(offers.map(o => o.id === offerId ? updatedOffer : o));
    } catch (error) {
      console.error('Error toggling offer show on load:', error);
      alert('Failed to update offer display settings');
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
              restaurantStatus.isOpen 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-gradient-to-r from-red-400 to-red-600'
            } mr-4`}>
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold">
                {restaurantStatus.isOpen ? 'Reservations are Open' : 'Reservations are Closed'}
              </p>
              <p className="text-sm text-gray-600">
                Click the button to change the restaurant's status
              </p>
            </div>
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <ChefHat className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Today's Special</h2>
        </div>
        {todaysSpecial.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysSpecial.map((special) => (
              <div key={special.id} className="border rounded-lg p-4 bg-amber-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{special.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{special.description}</p>
                    <p className="text-amber-600 font-semibold mt-2">{special.price} €</p>
                  </div>
                  {special.image && (
                    <img 
                      src={special.image} 
                      alt={special.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => special.id && toggleSpecialStatus(special.id)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      special.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {special.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => special.id && removeTodaysSpecial(special.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={addNewTodaysSpecial} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newTodaysSpecial.name}
                onChange={(e) => setNewTodaysSpecial({...newTodaysSpecial, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (€)</label>
              <input
                type="number"
                value={newTodaysSpecial.price}
                onChange={(e) => setNewTodaysSpecial({...newTodaysSpecial, price: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTodaysSpecial.description}
              onChange={(e) => setNewTodaysSpecial({...newTodaysSpecial, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={newTodaysSpecial.image}
              onChange={(e) => setNewTodaysSpecial({...newTodaysSpecial, image: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newTodaysSpecial.isActive}
              onChange={(e) => setNewTodaysSpecial({...newTodaysSpecial, isActive: e.target.checked})}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Active (Show on menu)
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              {isUpdating ? 'Adding...' : 'Add Special'}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Tag className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Special Offers</h2>
        </div>
        <form onSubmit={addNewOffer} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newOffer.title}
                onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                value={newOffer.discountPercentage}
                onChange={(e) => setNewOffer({...newOffer, discountPercentage: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newOffer.description}
              onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              rows={2}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid Until</label>
              <input
                type="date"
                value={newOffer.validUntil}
                onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={newOffer.showOnLoad}
                onChange={(e) => setNewOffer({...newOffer, showOnLoad: e.target.checked})}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Show as popup on page load
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Tag className="h-5 w-5 mr-2" />
              {isUpdating ? 'Adding...' : 'Add New Offer'}
            </button>
          </div>
        </form>
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900">Current Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className={`p-4 rounded-lg border ${
                  offer.isActive 
                    ? 'border-amber-200 bg-amber-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <span className="text-amber-600 font-semibold">
                    {offer.discountPercentage}% OFF
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="space-x-2">
                    <button
                      onClick={() => offer.id && toggleOfferStatus(offer.id)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        offer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <button
                    onClick={() => offer.id && removeOffer(offer.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      {upcomingReservations.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Reservations</h3>
            <ul className="mt-4">
              {upcomingReservations.map((reservation) => (
                <li key={reservation.date} className="text-gray-700">
                  {reservation.date}: {reservation.count} reservation(s)
                </li>
              ))}
            </ul>
            <button
              onClick={() => setUpcomingReservations([])}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;   