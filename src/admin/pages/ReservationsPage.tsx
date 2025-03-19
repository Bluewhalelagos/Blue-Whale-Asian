import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'firebase/firestore';

interface Reservation {
  id: string;          // This will be Firestore's document ID
  reservationId: string; // This will be your custom ID (reservation1, etc.)
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  persons: string;
  status: 'pending' | 'approved' | 'cancelled';
}

const columnHelper = createColumnHelper<Reservation>();

const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchReservations = async (date?: Date) => {
    setIsLoading(true);
    try {
      let reservationsQuery;
      
      if (date) {
        // Format date as YYYY-MM-DD for string comparison
        const dateString = date.toISOString().split('T')[0];
        
        reservationsQuery = query(
          collection(db, 'reservations'),
          // Assuming date is stored as an ISO string in Firestore
          // This will get all reservations for the selected day
          where('date', '>=', `${dateString}T00:00:00.000Z`),
          where('date', '<=', `${dateString}T23:59:59.999Z`),
          orderBy('date', 'asc')
        );
      } else {
        reservationsQuery = query(
          collection(db, 'reservations'),
          orderBy('date', 'desc')
        );
      }

      const snapshot = await getDocs(reservationsQuery);
      const reservationsList = snapshot.docs.map(doc => ({
        id: doc.id,  // Store Firestore's document ID
        ...doc.data(),
        reservationId: doc.data().id || 'unknown'  // Store your custom ID as reservationId
      })) as Reservation[];
      
      setReservations(reservationsList);
      console.log('Fetched reservations:', reservationsList);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(selectedDate || undefined);
  }, [selectedDate]);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'cancelled') => {
    try {
      // Check if we have a valid ID
      if (!id || id === 'undefined') {
        console.error('Invalid reservation ID:', id);
        alert('Cannot update: Invalid reservation ID');
        return;
      }
      
      console.log(`Attempting to update reservation ${id} to ${newStatus}`);
      
      // Debug: Print all available reservation IDs to check if this ID exists
      console.log('Available reservation IDs:', reservations.map(r => r.id));
      
      // Check if this ID is actually in our list
      const reservationExists = reservations.some(r => r.id === id);
      if (!reservationExists) {
        console.error(`Attempting to update a reservation that isn't in the current list: ${id}`);
      }
      
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, { status: newStatus });
      
      // Update the local state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id 
            ? { ...reservation, status: newStatus } 
            : reservation
        )
      );
      
      console.log(`Reservation ${id} updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      // More specific error message
      if (error.code === 'not-found') {
        alert(`Reservation with ID ${id} does not exist in the database`);
      } else {
        alert(`Update failed: ${error.message}`);
      }
    }
  };

  const columns = [
    columnHelper.accessor('reservationId', {  // Changed from 'id' to 'reservationId'
      header: 'Reservation ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Customer Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => {
        try {
          return new Date(info.getValue()).toLocaleDateString();
        } catch (e) {
          return 'Invalid Date';
        }
      },
    }),
    columnHelper.accessor('time', {
      header: 'Time',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('persons', {
      header: 'Guests',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'approved' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex space-x-2">
          {info.row.original.status === 'pending' && (
            <>
              <button 
                className="p-1 hover:bg-green-100 rounded"
                onClick={() => handleStatusChange(info.row.original.id, 'approved')}
                aria-label="Approve reservation"
              >
                <Check className="h-4 w-4 text-green-600" />
              </button>
              <button 
                className="p-1 hover:bg-red-100 rounded"
                onClick={() => handleStatusChange(info.row.original.id, 'cancelled')}
                aria-label="Cancel reservation"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search reservations..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Filter by date"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No reservations found for this date.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}</span>
                          {header.column.getIsSorted() && (
                            header.column.getIsSorted() === 'asc' ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;