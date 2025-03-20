import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { X, Phone, Calendar, Clock, Users, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

interface RestaurantStatus {
  isOpen: boolean;
  closedDays: string[]; // Array of days like ['Sunday', 'Monday']
  openingTime: string; // "09:00"
  closingTime: string; // "22:00"
  specialClosures: {
    date: string; // ISO string
    reason?: string;
  }[];
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date(),
    time: '12:00',
    persons: '2',
    specialRequests: '',
    occasion: '',
    preferredSeating: 'no preference'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLargeGroupMessage, setShowLargeGroupMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    closedDays: ['Sunday'],
    openingTime: "09:00",
    closingTime: "22:00",
    specialClosures: []
  });
  const [reservationId, setReservationId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Improved time slots generation function that handles closing times past midnight
  const generateTimeSlots = () => {
    const slots = [];
    // Default times in case restaurant status isn't loaded yet
    const opening = restaurantStatus?.openingTime || "09:00";
    const closing = restaurantStatus?.closingTime || "22:00";
    
    // Parse opening and closing hours
    const [openHour, openMinute] = opening.split(':').map(num => parseInt(num));
    const [closeHour, closeMinute] = closing.split(':').map(num => parseInt(num));
    
    // Convert to minutes for easier comparison
    const openingTimeMinutes = openHour * 60 + openMinute;
    let closingTimeMinutes = closeHour * 60 + closeMinute;
    
    // Handle cases where closing time is on the next day (after midnight)
    // If closing time is earlier than opening time, assume it's on the next day
    if (closingTimeMinutes < openingTimeMinutes) {
      closingTimeMinutes += 24 * 60; // Add 24 hours
    }
    
    // Generate slots every 15 minutes
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '15', '30', '45']) {
        const currentTimeMinutes = hour * 60 + parseInt(minute);
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
        
        // Check if time is within restaurant hours
        if (currentTimeMinutes >= openingTimeMinutes && currentTimeMinutes <= closingTimeMinutes) {
          slots.push(timeValue);
        }
        // For next day slots (after midnight)
        else if (closingTimeMinutes > 24 * 60 && currentTimeMinutes + 24 * 60 <= closingTimeMinutes) {
          slots.push(timeValue);
        }
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  useEffect(() => {
    // Fetch restaurant status when modal opens
    const fetchRestaurantStatus = async () => {
      setIsLoading(true);
      try {
        const statusDoc = await getDoc(doc(db, 'settings', 'restaurantStatus'));
        if (statusDoc.exists()) {
          setRestaurantStatus(statusDoc.data() as RestaurantStatus);
          
          // Set default time to opening time if current time isn't set
          const statusData = statusDoc.data() as RestaurantStatus;
          if (statusData.openingTime && (!formData.time || formData.time === '12:00')) {
            setFormData(prev => ({...prev, time: statusData.openingTime}));
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant status:', error);
        // Keep the default values in case of error
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchRestaurantStatus();
    }
  }, [isOpen]);

  // Helper function to check if a time is within restaurant hours, handling overnight hours
  const isTimeWithinRestaurantHours = (time: string) => {
    const opening = restaurantStatus?.openingTime || "09:00";
    const closing = restaurantStatus?.closingTime || "22:00";
    
    // Parse opening and closing hours
    const [openHour, openMinute] = opening.split(':').map(num => parseInt(num));
    const [closeHour, closeMinute] = closing.split(':').map(num => parseInt(num));
    
    // Parse selected time
    const [selectedHour, selectedMinute] = time.split(':').map(num => parseInt(num));
    
    // Convert all to minutes for easier comparison
    const openingTimeMinutes = openHour * 60 + openMinute;
    let closingTimeMinutes = closeHour * 60 + closeMinute;
    const selectedTimeMinutes = selectedHour * 60 + selectedMinute;
    
    // If closing time is earlier than opening time, it's assumed to be on the next day
    if (closingTimeMinutes < openingTimeMinutes) {
      closingTimeMinutes += 24 * 60; // Add 24 hours
      
      // For times after midnight, we need to adjust the comparison
      if (selectedTimeMinutes < openingTimeMinutes) {
        // Early morning hours, check if they're before closing time
        return selectedTimeMinutes + 24 * 60 <= closingTimeMinutes;
      }
    }
    
    return selectedTimeMinutes >= openingTimeMinutes && selectedTimeMinutes <= closingTimeMinutes;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Check if the restaurant is closed on the selected day
    const dayOfWeek = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' });
    if (restaurantStatus.closedDays?.includes(dayOfWeek)) {
      newErrors.date = `We are closed on ${dayOfWeek}s`;
    }
    
    // Check if the selected time is outside operating hours
    if (!isTimeWithinRestaurantHours(formData.time)) {
      newErrors.time = `Restaurant hours are ${restaurantStatus.openingTime} to ${restaurantStatus.closingTime}`;
    }
    
    // Check for special closures
    const selectedDateStr = formData.date.toISOString().split('T')[0];
    const isSpecialClosure = restaurantStatus.specialClosures?.some(
      closure => closure.date.split('T')[0] === selectedDateStr
    );
    
    if (isSpecialClosure) {
      const closure = restaurantStatus.specialClosures?.find(
        c => c.date.split('T')[0] === selectedDateStr
      );
      newErrors.date = closure?.reason || 'Restaurant is closed on this date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNextReservationId = async () => {
    const reservationsRef = collection(db, 'reservations');
    const q = query(reservationsRef, orderBy('reservationId', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return 'reservation1';
    }
    
    const lastDoc = querySnapshot.docs[0];
    const lastId = lastDoc.data().reservationId || lastDoc.data().id;
    const lastNumber = parseInt(lastId.replace('reservation', ''));
    return `reservation${lastNumber + 1}`;
  };

  const handlePersonsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({...formData, persons: value});
    
    // Show large group message if more than 6 persons
    setShowLargeGroupMessage(parseInt(value) > 6);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If group size > 6, don't proceed with submission
    if (parseInt(formData.persons) > 6) {
      setShowLargeGroupMessage(true);
      return;
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const nextId = await getNextReservationId();
        const docRef = await addDoc(collection(db, 'reservations'), {
          reservationId: nextId,
          ...formData,
          date: formData.date.toISOString(),
          status: 'approved', // Auto-approve reservations for 6 or fewer people
          createdAt: new Date().toISOString()
        });
        
        setReservationId(nextId);
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error submitting reservation:', error);
        alert('Failed to submit reservation. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!restaurantStatus.closedDays) return false;
    
    // Check if day is in closed days
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (restaurantStatus.closedDays.includes(dayOfWeek)) {
      return true;
    }
    
    // Check if date is in special closures
    const dateStr = date.toISOString().split('T')[0];
    return restaurantStatus.specialClosures?.some(
      closure => closure.date.split('T')[0] === dateStr
    ) || false;
  };

  const ConfirmationMessage = () => (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-2xl font-bold text-green-700">Reservation Confirmed!</h3>
      <div className="bg-green-50 p-6 rounded-lg">
        <p className="text-gray-700 mb-4">
          Your table has been reserved. We look forward to serving you!
        </p>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="font-medium">Reservation ID:</span>
            <span>{reservationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{formData.date.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Time:</span>
            <span>{formData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Party Size:</span>
            <span>{formData.persons}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-blue-900 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors"
      >
        Done
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
        {showConfirmation ? (
          <ConfirmationMessage />
        ) : showLargeGroupMessage ? (
          <div className="text-center space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">GROUP RESERVATION</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <Users className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Large Group Booking</h3>
              <p className="text-gray-700 mb-4">
                For groups of 7 or more, we require a phone confirmation to ensure we can accommodate your party.
              </p>
              <div className="flex items-center justify-center text-blue-900 font-bold text-xl">
                <Phone className="h-6 w-6 mr-2" />
                <a href="tel:8010888216" className="hover:underline">Call 8010888216</a>
              </div>
            </div>
            
            <button
              onClick={() => setShowLargeGroupMessage(false)}
              className="text-blue-600 hover:underline"
            >
              Go back to reservation form
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-10">
            <p>Loading reservation system...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">TABLE RESERVATION</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {restaurantStatus.closedDays && restaurantStatus.closedDays.includes('Sunday') && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-red-700 font-medium">SUNDAY CLOSED!</p>
                    <p className="text-sm text-red-600">Please select another day for your reservation.</p>
                  </div>
                </div>
              </div>
            )}

            {!restaurantStatus.isOpen && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-yellow-700 font-medium">NOTICE</p>
                    <p className="text-sm text-yellow-600">
                      The restaurant is currently closed for regular service. You can still make reservations for future dates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Contact Information</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="border-t pt-5 space-y-4">
                <h3 className="font-medium text-gray-800">Reservation Details</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({...formData, date: date || new Date()})}
                    minDate={new Date()}
                    filterDate={date => !isDateDisabled(date)}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    {timeSlots.length > 0 ? (
                      timeSlots.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    ) : (
                      <option value={formData.time}>{formData.time}</option>
                    )}
                  </select>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.persons}
                    onChange={handlePersonsChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                  {parseInt(formData.persons) > 6 && (
                    <p className="text-amber-600 text-sm mt-1">Groups of 7+ require phone confirmation</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-5 space-y-4">
                <h3 className="font-medium text-gray-800">Special Requests</h3>
                
                <div>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select an occasion (optional)</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="business">Business Meal</option>
                    <option value="date">Date Night</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <select
                    value={formData.preferredSeating}
                    onChange={(e) => setFormData({...formData, preferredSeating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="no preference">Seating Preference</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="window">Window</option>
                    <option value="private">Private (if available)</option>
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    placeholder="Any special requests or dietary requirements?"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || parseInt(formData.persons) > 6}
              >
                {isSubmitting ? 'Submitting...' : 'Book a Table'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;