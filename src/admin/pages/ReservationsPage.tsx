"use client"

import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Check, X, ChevronUp, ChevronDown, Eye } from "lucide-react"
import { db } from "../../firebase/config"
import { collection, query, orderBy, getDocs, doc, updateDoc, where, Timestamp } from "firebase/firestore"

interface Reservation {
  id: string
  reservationId: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  persons: string
  status: "unread" | "pending" | "approved" | "cancelled"
  specialRequests?: string
  occasion?: string
  preferredSeating?: string
  createdAt?: string
}

const columnHelper = createColumnHelper<Reservation>()

const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }])
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [highlightedReservationId, setHighlightedReservationId] = useState<string | null>(null)

  const fetchReservations = async (date?: Date) => {
    setIsLoading(true)
    try {
      let reservationsQuery

      if (date) {
        // Format date as YYYY-MM-DD for string comparison
        // Make sure we use local timezone to prevent day offset issues
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateString = `${year}-${month}-${day}`
        
        // Create date range for the entire selected day
        const startOfDay = `${dateString}T00:00:00.000Z`
        const endOfDay = `${dateString}T23:59:59.999Z`
        
        console.log(`Fetching reservations for date range: ${startOfDay} to ${endOfDay}`)
        
        reservationsQuery = query(
          collection(db, "reservations"),
          where("date", ">=", startOfDay),
          where("date", "<=", endOfDay),
          orderBy("date", "asc")
        )
      } else {
        // If no date filter, sort by creation date (newest first)
        reservationsQuery = query(collection(db, "reservations"), orderBy("createdAt", "desc"))
      }

      const snapshot = await getDocs(reservationsQuery)
      const reservationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        reservationId: doc.data().reservationId || "unknown",
      })) as Reservation[]

      setReservations(reservationsList)
      console.log("Fetched reservations:", reservationsList)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      // Show a more specific error message to help with debugging
      if (error.code === 'failed-precondition') {
        console.error("This query requires an index. Follow the link in the Firebase console to create it:", error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations(selectedDate || undefined)
  }, [selectedDate])

  // Check for highlighted reservation from dashboard
  useEffect(() => {
    const highlightedId = sessionStorage.getItem("highlightedReservationId")
    if (highlightedId) {
      setHighlightedReservationId(highlightedId)
      // Clear from session storage after retrieving
      sessionStorage.removeItem("highlightedReservationId")

      // Find and show details for the highlighted reservation
      const reservation = reservations.find((r) => r.id === highlightedId)
      if (reservation) {
        viewReservationDetails(reservation)
      }
    }
  }, [reservations])

  const handleStatusChange = async (id: string, newStatus: "approved" | "cancelled" | "pending") => {
    try {
      // Check if we have a valid ID
      if (!id || id === "undefined") {
        console.error("Invalid reservation ID:", id)
        alert("Cannot update: Invalid reservation ID")
        return
      }

      console.log(`Attempting to update reservation ${id} to ${newStatus}`)

      // Debug: Print all available reservation IDs to check if this ID exists
      console.log(
        "Available reservation IDs:",
        reservations.map((r) => r.id),
      )

      // Check if this ID is actually in our list
      const reservationExists = reservations.some((r) => r.id === id)
      if (!reservationExists) {
        console.error(`Attempting to update a reservation that isn't in the current list: ${id}`)
      }

      const reservationRef = doc(db, "reservations", id)
      await updateDoc(reservationRef, { status: newStatus })

      // Update the local state
      setReservations((prev) =>
        prev.map((reservation) => (reservation.id === id ? { ...reservation, status: newStatus } : reservation)),
      )

      console.log(`Reservation ${id} updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating reservation status:", error)
      // More specific error message
      if (error.code === "not-found") {
        alert(`Reservation with ID ${id} does not exist in the database`)
      } else {
        alert(`Update failed: ${error.message}`)
      }
    }
  }

  const viewReservationDetails = (reservation: Reservation) => {
    // If the reservation is unread, mark it as pending when viewed
    if (reservation.status === "unread") {
      handleStatusChange(reservation.id, "pending")
    }
    setSelectedReservation(reservation)
    setShowDetailModal(true)
  }

  const columns = [
    columnHelper.accessor("reservationId", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Customer",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        try {
          return new Date(info.getValue()).toLocaleDateString()
        } catch (e) {
          return "Invalid Date"
        }
      },
    }),
    columnHelper.accessor("time", {
      header: "Time",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("persons", {
      header: "Guests",
      cell: (info) => (
        <span className={Number.parseInt(info.getValue()) > 6 ? "font-bold text-amber-600" : ""}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue(),
      enableHiding: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            info.getValue() === "approved"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "cancelled"
                ? "bg-red-100 text-red-800"
                : info.getValue() === "unread"
                  ? "bg-blue-100 text-blue-800 font-bold"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (info) => {
        try {
          return new Date(info.getValue() || "").toLocaleString()
        } catch (e) {
          return "N/A"
        }
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            className="p-1 hover:bg-blue-100 rounded"
            onClick={() => viewReservationDetails(info.row.original)}
            aria-label="View reservation details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          {(info.row.original.status === "pending" || info.row.original.status === "unread") && (
            <>
              <button
                className="p-1 hover:bg-green-100 rounded"
                onClick={() => handleStatusChange(info.row.original.id, "approved")}
                aria-label="Approve reservation"
              >
                <Check className="h-4 w-4 text-green-600" />
              </button>
              <button
                className="p-1 hover:bg-red-100 rounded"
                onClick={() => handleStatusChange(info.row.original.id, "cancelled")}
                aria-label="Cancel reservation"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </>
          )}
        </div>
      ),
    }),
  ]
  
  // Function to check if a date is Wednesday (day 3)
  const isNotWednesday = (date: Date) => {
    const day = date.getDay();
    return day !== 3; // 3 is Wednesday in JavaScript's getDay() (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  };
  
  // Function to validate the selected date is not a Wednesday
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = date.getDay();
      if (day === 3) { // Wednesday
        alert("Reservations are not available on Wednesdays");
        return;
      }
    }
    setSelectedDate(date);
  };
  
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
  })

  const ReservationDetailModal = () => {
    if (!selectedReservation || !showDetailModal) return null

    const reservation = selectedReservation

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reservation Details</h2>
            <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Reservation Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{reservation.reservationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{reservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className={`font-medium ${Number.parseInt(reservation.persons) > 6 ? "text-amber-600" : ""}`}>
                      {reservation.persons}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        reservation.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : reservation.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : reservation.status === "unread"
                              ? "bg-blue-100 text-blue-800 font-bold"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Customer Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{reservation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{reservation.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{reservation.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Special Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Occasion:</span>
                  <span className="font-medium ml-2">
                    {reservation.occasion ? reservation.occasion : "None specified"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Preferred Seating:</span>
                  <span className="font-medium ml-2">
                    {reservation.preferredSeating ? reservation.preferredSeating : "No preference"}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-600">Special Requests:</span>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded">
                  {reservation.specialRequests ? reservation.specialRequests : "None specified"}
                </div>
              </div>
            </div>

            {(reservation.status === "pending" || reservation.status === "unread") && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    handleStatusChange(reservation.id, "approved")
                    setShowDetailModal(false)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                  Approve Reservation
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(reservation.id, "cancelled")
                    setShowDetailModal(false)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <input
            type="text"
            placeholder="Search reservations..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
          />
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
            placeholderText="Filter by date"
            dateFormat="yyyy-MM-dd"
            filterDate={isNotWednesday}
            highlightDates={[
              {
                dates: Array.from({ length: 52 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + (3 + 7 * i - date.getDay()) % 7);
                  return date;
                }),
                className: 'text-red-500 line-through bg-red-100'
              }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="p-4 text-center">No reservations found for the selected date.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <span>
                            {{
                              asc: <ChevronUp className="h-4 w-4" />,
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${highlightedReservationId === row.original.id ? "bg-amber-100" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => viewReservationDetails(row.original)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile view for small screens */}
      <div className="md:hidden">
        {!isLoading && reservations.length > 0 && (
          <div className="space-y-4 mt-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  highlightedReservationId === reservation.id ? "border-amber-500 bg-amber-50" : "border-blue-500"
                }`}
                onClick={() => viewReservationDetails(reservation)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{reservation.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : reservation.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : reservation.status === "unread"
                            ? "bg-blue-100 text-blue-800 font-bold"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm">
                    <span className="font-medium">{reservation.persons}</span>{" "}
                    {Number.parseInt(reservation.persons) === 1 ? "person" : "people"}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 hover:bg-blue-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation()
                        viewReservationDetails(reservation)
                      }}
                    >
                      <Eye className="h-5 w-5 text-blue-600" />
                    </button>
                    {(reservation.status === "pending" || reservation.status === "unread") && (
                      <>
                        <button
                          className="p-1 hover:bg-green-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(reservation.id, "approved")
                          }}
                        >
                          <Check className="h-5 w-5 text-green-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(reservation.id, "cancelled")
                          }}
                        >
                          <X className="h-5 w-5 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetailModal && <ReservationDetailModal />}
    </div>
  )
}

export default ReservationsPage