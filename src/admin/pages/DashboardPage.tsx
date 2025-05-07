"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  Trash2,
  Check,
  Clock,
  Ban,
} from "lucide-react"
import { db } from "../../firebase/config"
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
  deleteDoc,
  where,
  Timestamp,
} from "firebase/firestore"

interface Contact {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

interface Reservation {
  id: string
  reservationId?: string
  name: string
  email?: string
  phone?: string
  date: string
  time: string
  persons: string
  status: "unread" | "pending" | "approved" | "cancelled"
  specialRequests?: string
  occasion?: string
  preferredSeating?: string
  createdAt?: string
}

interface RestaurantStatus {
  isOpen: boolean
  lastUpdated: string
  blockedTimeSlots?: {
    date: string
    time?: string
    reason?: string
    isFullDay?: boolean
  }[]
}

interface AdminSession {
  lastLogin: Timestamp
  userId: string
}

interface TodaysSpecial {
  id?: string
  name: string
  description: string
  price: number
  image: string
  isActive: boolean
}

interface Offer {
  id?: string
  title: string
  description: string
  discountPercentage: number
  validUntil: string
  isActive: boolean
  showOnLoad: boolean
}


interface BlockTimeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onBlock: (date: string, time: string, reason: string, isFullDay?: boolean) => Promise<void>
}

const BlockTimeSlotModal: React.FC<BlockTimeSlotModalProps> = ({ isOpen, onClose, onBlock }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState<string>("18:00")
  const [reason, setReason] = useState<string>("")
  const [isFullDay, setIsFullDay] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onBlock(date, time, reason, isFullDay)
      onClose()
    } catch (error) {
      console.error("Error blocking time slot:", error)
      alert("Failed to block time slot")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Block Time Slot</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fullDayCheckbox"
              checked={isFullDay}
              onChange={(e) => setIsFullDay(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="fullDayCheckbox" className="ml-2 block text-sm text-gray-900">
              Block entire day
            </label>
          </div>
          
          {!isFullDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) =>
                  ["00", "15", "30", "45"].map((minute) => {
                    const timeValue = `${hour.toString().padStart(2, "0")}:${minute}`
                    return (
                      <option key={timeValue} value={timeValue}>
                        {timeValue}
                      </option>
                    )
                  }),
                )}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              {isSubmitting ? "Blocking..." : isFullDay ? "Block Full Day" : "Block Time Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    lastUpdated: new Date().toISOString(),
    blockedTimeSlots: [],
  })
  const [stats, setStats] = useState({
    reservations: 0,
    menuItems: 48,
    applications: 0,
    deliveries: 18,
  })
  const [todaysSpecial, setTodaysSpecial] = useState<TodaysSpecial[]>([])
  const [newTodaysSpecial, setNewTodaysSpecial] = useState<TodaysSpecial>({
    name: "",
    description: "",
    price: 0,
    image: "",
    isActive: false,
  })
  const [offers, setOffers] = useState<Offer[]>([])
  const [newOffer, setNewOffer] = useState<Offer>({
    title: "",
    description: "",
    discountPercentage: 0,
    validUntil: new Date().toISOString().split("T")[0],
    isActive: true,
    showOnLoad: true,
  })
  const [newReservations, setNewReservations] = useState<Reservation[]>([])
  const [showNewReservationsPopup, setShowNewReservationsPopup] = useState(false)
  const [showBlockTimeSlotModal, setShowBlockTimeSlotModal] = useState(false)
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<RestaurantStatus["blockedTimeSlots"]>([])

  // Use sessionStorage to track if popup has been shown in this session
  useEffect(() => {
    const popupShownThisSession = sessionStorage.getItem("reservationPopupShown")
    if (popupShownThisSession === "true") {
      setShowNewReservationsPopup(false)
    }
  }, [])

  const addNewTodaysSpecial = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const specialRef = doc(collection(db, "specials"))
      const specialWithId = { ...newTodaysSpecial, id: specialRef.id }
      await setDoc(specialRef, specialWithId)
      setTodaysSpecial([...todaysSpecial, specialWithId])
      alert("Today's Special added successfully!")
      setNewTodaysSpecial({
        name: "",
        description: "",
        price: 0,
        image: "",
        isActive: false,
      })
    } catch (error) {
      console.error("Error adding today's special:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to add Today's Special")
    } finally {
      setIsUpdating(false)
    }
  }

  const removeTodaysSpecial = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this special?")) return
    setIsUpdating(true)
    try {
      await deleteDoc(doc(db, "specials", id))
      setTodaysSpecial(todaysSpecial.filter((special) => special.id !== id))
      alert("Special removed successfully!")
    } catch (error) {
      console.error("Error removing special:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to remove special")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleSpecialStatus = async (id: string) => {
    const special = todaysSpecial.find((s) => s.id === id)
    if (!special) return
    setIsUpdating(true)
    try {
      const updatedSpecial = { ...special, isActive: !special.isActive }
      await updateDoc(doc(db, "specials", id), updatedSpecial)
      setTodaysSpecial(todaysSpecial.map((s) => (s.id === id ? updatedSpecial : s)))
    } catch (error) {
      console.error("Error updating special status:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to update special status")
    } finally {
      setIsUpdating(false)
    }
  }

  const blockTimeSlot = async (date: string, time: string, reason: string, isFullDay: boolean = false) => {
    setIsUpdating(true)
    try {
      let updatedBlockedSlots;
      
      if (isFullDay) {
        // For full day blocking, create entries for all time slots in the day
        // or use a special marker to indicate full day blocking
        const fullDayBlock = { date, isFullDay: true, reason }
        
        // Remove any existing individual time slots for this date
        const filteredSlots = (restaurantStatus.blockedTimeSlots || []).filter(
          (slot) => slot.date !== date
        )
        
        updatedBlockedSlots = [...filteredSlots, fullDayBlock]
        alert(`All time slots on ${date} have been blocked.`)
      } else {
        // Regular single time slot blocking
        const newBlockedSlot = { date, time, reason }
        updatedBlockedSlots = [...(restaurantStatus.blockedTimeSlots || []), newBlockedSlot]
        alert(`Time slot ${time} on ${date} has been blocked.`)
      }

      const updatedStatus = {
        ...restaurantStatus,
        blockedTimeSlots: updatedBlockedSlots,
      }

      await updateDoc(doc(db, "settings", "restaurantStatus"), updatedStatus)
      setRestaurantStatus(updatedStatus)
      setBlockedTimeSlots(updatedBlockedSlots)
    } catch (error) {
      console.error("Error blocking time slot:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to block time slot")
    } finally {
      setIsUpdating(false)
    }
  }

  const unblockTimeSlot = async (date: string, time?: string) => {
    if (!window.confirm("Are you sure you want to unblock this time slot?")) return

    setIsUpdating(true)
    try {
      let updatedBlockedSlots;
      
      if (!time) {
        // Unblocking a full day
        updatedBlockedSlots = (restaurantStatus.blockedTimeSlots || []).filter(
          (slot) => slot.date !== date
        )
        alert(`All time slots on ${date} have been unblocked.`)
      } else {
        // Unblocking a specific time slot
        updatedBlockedSlots = (restaurantStatus.blockedTimeSlots || []).filter(
          (slot) => !(slot.date === date && slot.time === time)
        )
        alert(`Time slot ${time} on ${date} has been unblocked.`)
      }

      const updatedStatus = {
        ...restaurantStatus,
        blockedTimeSlots: updatedBlockedSlots,
      }

      await updateDoc(doc(db, "settings", "restaurantStatus"), updatedStatus)
      setRestaurantStatus(updatedStatus)
      setBlockedTimeSlots(updatedBlockedSlots)
    } catch (error) {
      console.error("Error unblocking time slot:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to unblock time slot")
    } finally {
      setIsUpdating(false)
    }
  }

  const updateAdminLastLogin = async () => {
    try {
      // In a real app, you'd get the actual user ID from authentication
      const userId = "admin"
      const adminSessionRef = doc(db, "adminSessions", userId)

      // Update the last login time
      await setDoc(adminSessionRef, {
        lastLogin: Timestamp.now(),
        userId,
      })

      console.log("Admin session updated")
    } catch (error) {
      console.error("Error updating admin session:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get admin's last login time
        let lastLoginTime: Timestamp | null = null
        try {
          // In a real app, you'd get the actual user ID from authentication
          const userId = "admin"
          const adminSessionDoc = await getDoc(doc(db, "adminSessions", userId))

          if (adminSessionDoc.exists()) {
            const adminSession = adminSessionDoc.data() as AdminSession
            lastLoginTime = adminSession.lastLogin
          }
        } catch (error) {
          console.error("Error fetching admin session:", error)
        }

        // Update admin's last login time
        await updateAdminLastLogin()

        const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"), limit(5))
        const contactsSnapshot = await getDocs(contactsQuery)
        const contactsList = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Contact[]
        setContacts(contactsList)

        // Get all reservations ordered by creation date (newest first)
        const reservationsQuery = query(collection(db, "reservations"), orderBy("createdAt", "desc"), limit(5))
        const reservationsSnapshot = await getDocs(reservationsQuery)
        const reservationsList = reservationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reservation[]
        setReservations(reservationsList)

        // Get new reservations since last login
        if (lastLoginTime) {
          const newReservationsQuery = query(
            collection(db, "reservations"),
            where("createdAt", ">", lastLoginTime.toDate().toISOString()),
            orderBy("createdAt", "desc"),
          )

          const newReservationsSnapshot = await getDocs(newReservationsQuery)
          const newReservationsList = newReservationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Reservation[]

          if (newReservationsList.length > 0) {
            setNewReservations(newReservationsList)

            // Only show popup if it hasn't been shown in this session
            const popupShownThisSession = sessionStorage.getItem("reservationPopupShown")
            if (popupShownThisSession !== "true") {
              setShowNewReservationsPopup(true)
              // Mark popup as shown for this session
              sessionStorage.setItem("reservationPopupShown", "true")
            }
          }
        }

        const statusDoc = await getDoc(doc(db, "settings", "restaurantStatus"))
        if (statusDoc.exists()) {
          const statusData = statusDoc.data() as RestaurantStatus
          setRestaurantStatus(statusData)
          setBlockedTimeSlots(statusData.blockedTimeSlots || [])
        }

        const specialsSnapshot = await getDocs(collection(db, "specials"))
        const specialsList = specialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TodaysSpecial[]
        setTodaysSpecial(specialsList)

        const offersQuery = query(collection(db, "offers"))
        const offersSnapshot = await getDocs(offersQuery)
        const offersList = offersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Offer[]
        setOffers(offersList)

        setStats((prev) => ({
          ...prev,
          reservations: reservationsSnapshot.size,
          applications: contactsSnapshot.size,
        }))

        const upcomingDates = reservationsList.reduce((acc: { [key: string]: number }, reservation) => {
          const date = new Date(reservation.date).toLocaleDateString()
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})
      } catch (error) {
        console.error("Error fetching data:", error instanceof Error ? error.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

    const toggleRestaurantStatus = async () => {
    setIsUpdating(true)
    try {
      // Removed Wednesday block to allow opening on Wednesdays
      // const today = new Date()
      // const isWednesday = today.getDay() === 3 // Wednesday is day 3 (0 = Sunday)

      // // If it's Wednesday, show an alert and don't allow opening
      // if (isWednesday && !restaurantStatus.isOpen) {
      //   alert("The restaurant is closed for reservations every Wednesday.")
      //   setIsUpdating(false)
      //   return
      // }

      const updatedStatus = {
        ...restaurantStatus,
        // isOpen: isWednesday ? false : !restaurantStatus.isOpen,
        isOpen: !restaurantStatus.isOpen,
        lastUpdated: new Date().toISOString(),
      }
      await updateDoc(doc(db, "settings", "restaurantStatus"), updatedStatus)
      setRestaurantStatus(updatedStatus)
    } catch (error) {
      console.error("Error updating restaurant status:", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsUpdating(false)
    }
  }

  const addNewOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const offerRef = doc(collection(db, "offers"))
      const offerWithId = { ...newOffer, id: offerRef.id }
      await setDoc(offerRef, offerWithId)
      setOffers([...offers, offerWithId])
      setNewOffer({
        title: "",
        description: "",
        discountPercentage: 0,
        validUntil: new Date().toISOString().split("T")[0],
        isActive: true,
        showOnLoad: true,
      })
      alert("New offer added successfully!")
    } catch (error) {
      console.error("Error adding new offer:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to add new offer")
    } finally {
      setIsUpdating(false)
    }
  }

  const removeOffer = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this offer?")) return
    setIsUpdating(true)
    try {
      await deleteDoc(doc(db, "offers", id))
      setOffers(offers.filter((offer) => offer.id !== id))
      alert("Offer removed successfully!")
    } catch (error) {
      console.error("Error removing offer:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to remove offer")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleOfferStatus = async (offerId: string) => {
    const offerToUpdate = offers.find((o) => o.id === offerId)
    if (!offerToUpdate) return
    try {
      const updatedOffer = { ...offerToUpdate, isActive: !offerToUpdate.isActive }
      await updateDoc(doc(db, "offers", offerId), updatedOffer)
      setOffers(offers.map((o) => (o.id === offerId ? updatedOffer : o)))
    } catch (error) {
      console.error("Error toggling offer status:", error instanceof Error ? error.message : "Unknown error")
      alert("Failed to update offer status")
    }
  }


  const handleStatusChange = async (id: string, newStatus: "approved" | "cancelled" | "pending") => {
    try {
      if (!id || id === "undefined") {
        console.error("Invalid reservation ID:", id)
        alert("Cannot update: Invalid reservation ID")
        return
      }

      const reservationRef = doc(db, "reservations", id)
      await updateDoc(reservationRef, { status: newStatus })

      // Update the local state
      setReservations((prev) =>
        prev.map((reservation) => (reservation.id === id ? { ...reservation, status: newStatus } : reservation)),
      )

      // If the selected reservation is being updated, update it too
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, status: newStatus })
      }

      console.log(`Reservation ${id} updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating reservation status:", error instanceof Error ? error.message : "Unknown error")
      alert(`Update failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const viewReservationDetails = (reservation: Reservation) => {
    // If the reservation is unread, mark it as pending when viewed
    if (reservation.status === "unread") {
      handleStatusChange(reservation.id, "pending")
    }
    setSelectedReservation(reservation)
  }

  const navigateToReservation = (reservationId: string) => {
    // Store the ID in sessionStorage to highlight it on the reservations page
    sessionStorage.setItem("highlightedReservationId", reservationId)
    // Navigate to reservations page
    window.location.href = "/admin/reservations"
  }

  const statsCards = [
    {
      title: "Total Reservations",
      value: stats.reservations.toString(),
      icon: CalendarDays,
      change: "+12%",
      color: "bg-blue-500",
    },
    {
      title: "Menu Items",
      value: stats.menuItems.toString(),
      icon: UtensilsCrossed,
      change: "+3%",
      color: "bg-amber-500",
    },
    {
      title: "Contact Messages",
      value: stats.applications.toString(),
      icon: Users,
      change: "+5%",
      color: "bg-green-500",
    },
    {
      title: "Active Deliveries",
      value: stats.deliveries.toString(),
      icon: Truck,
      change: "+8%",
      color: "bg-purple-500",
    },
  ]

  const ReservationDetailModal = () => {
    if (!selectedReservation) return null

    const reservation = selectedReservation

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reservation Details</h2>
            <button
              onClick={() => setSelectedReservation(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Reservation Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded">
                      {reservation.reservationId || reservation.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded">
                      {new Date(reservation.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded">{reservation.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Guests:</span>
                    <span
                      className={`font-medium bg-white px-2 py-1 rounded ${Number.parseInt(reservation.persons) > 6 ? "text-amber-600" : ""}`}
                    >
                      {reservation.persons}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : reservation.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : reservation.status === "unread"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-xs bg-white px-2 py-1 rounded">
                      {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded">{reservation.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded">{reservation.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium bg-white px-2 py-1 rounded text-sm truncate max-w-[180px]">
                      {reservation.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Special Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 block mb-1">Occasion:</span>
                  <span className="font-medium bg-white px-3 py-1.5 rounded block">
                    {reservation.occasion ? reservation.occasion : "None specified"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Preferred Seating:</span>
                  <span className="font-medium bg-white px-3 py-1.5 rounded block">
                    {reservation.preferredSeating ? reservation.preferredSeating : "No preference"}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-600 block mb-1">Special Requests:</span>
                <div className="mt-1 p-3 bg-white border border-amber-200 rounded-lg min-h-[60px]">
                  {reservation.specialRequests ? reservation.specialRequests : "None specified"}
                </div>
              </div>
            </div>

            {(reservation.status === "pending" || reservation.status === "unread") && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(reservation.id, "approved")
                    setSelectedReservation(null)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve Reservation
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(reservation.id, "cancelled")
                    setSelectedReservation(null)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel Reservation
                </button>
              </div>
            )}

            {(reservation.status === "approved" || reservation.status === "cancelled") && (
              <div className="mt-6">
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const NewReservationsPopup = () => {
    if (!showNewReservationsPopup || newReservations.length === 0) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
              New Reservations
            </h3>
            <button
              onClick={() => setShowNewReservationsPopup(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {newReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => navigateToReservation(reservation.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{reservation.name}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                    {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowNewReservationsPopup(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>
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
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center ${
                restaurantStatus.isOpen
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-red-400 to-red-600"
              } mr-4`}
            >
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold">
                {restaurantStatus.isOpen ? "Reservations are Open" : "Reservations are Closed"}
              </p>
              <p className="text-sm text-gray-600">Click the button to change the restaurant's status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBlockTimeSlotModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Clock className="h-5 w-5 inline mr-1" />
              Block Time Slot
            </button>
            <button
              onClick={toggleRestaurantStatus}
              disabled={isUpdating}
              className={`${
                restaurantStatus.isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white py-2 px-4 rounded-lg transition-colors duration-200 min-w-32`}
            >
              {isUpdating ? "Updating..." : restaurantStatus.isOpen ? "Mark as Closed" : "Mark as Open"}
            </button>
          </div>
        </div>
      </div>

      {blockedTimeSlots && blockedTimeSlots.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Ban className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Blocked Time Slots</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockedTimeSlots.map((slot, index) => (
              <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 text-red-500 mr-1" />
                      <span className="font-medium">{new Date(slot.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-red-500 mr-1" />
                      <span>{slot.time}</span>
                    </div>
                    {slot.reason && <p className="text-sm text-gray-600 mt-1">Reason: {slot.reason}</p>}
                  </div>
                  <button
                    onClick={() => unblockTimeSlot(slot.date, slot.time)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      src={special.image || "/placeholder.svg"}
                      alt={special.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => special.id && toggleSpecialStatus(special.id)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      special.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {special.isActive ? "Active" : "Inactive"}
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
                onChange={(e) => setNewTodaysSpecial({ ...newTodaysSpecial, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (€)</label>
              <input
                type="number"
                value={newTodaysSpecial.price}
                onChange={(e) => setNewTodaysSpecial({ ...newTodaysSpecial, price: Number.parseFloat(e.target.value) })}
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
              onChange={(e) => setNewTodaysSpecial({ ...newTodaysSpecial, description: e.target.value })}
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
              onChange={(e) => setNewTodaysSpecial({ ...newTodaysSpecial, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newTodaysSpecial.isActive}
              onChange={(e) => setNewTodaysSpecial({ ...newTodaysSpecial, isActive: e.target.checked })}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Active (Show on menu)</label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              {isUpdating ? "Adding..." : "Add Special"}
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
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                value={newOffer.discountPercentage}
                onChange={(e) => setNewOffer({ ...newOffer, discountPercentage: Number.parseInt(e.target.value) })}
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
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
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
                onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={newOffer.showOnLoad}
                onChange={(e) => setNewOffer({ ...newOffer, showOnLoad: e.target.checked })}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Show as popup on page load</label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Tag className="h-5 w-5 mr-2" />
              {isUpdating ? "Adding..." : "Add New Offer"}
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
                  offer.isActive ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  <span className="text-amber-600 font-semibold">{offer.discountPercentage}% OFF</span>
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
                        offer.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Inactive"}
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
                <button onClick={() => setSelectedContact(contact)} className="p-1 hover:bg-gray-200 rounded">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(contact.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Reservations</h2>

        {/* Desktop table view - hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 cursor-pointer">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => viewReservationDetails(reservation)}
                  >
                    {reservation.name}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => viewReservationDetails(reservation)}
                  >
                    {new Date(reservation.date).toLocaleDateString()}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => viewReservationDetails(reservation)}
                  >
                    {reservation.time}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => viewReservationDetails(reservation)}
                  >
                    {reservation.persons}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={() => viewReservationDetails(reservation)}>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
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
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    onClick={() => viewReservationDetails(reservation)}
                  >
                    {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => viewReservationDetails(reservation)}
                      className="p-1 hover:bg-blue-100 rounded"
                      aria-label="View reservation details"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden">
          {reservations.length > 0 ? (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md active:scale-[0.99]"
                  onClick={() => viewReservationDetails(reservation)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{reservation.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {new Date(reservation.date).toLocaleDateString()}
                        <span className="mx-1.5">•</span>
                        {reservation.time}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : "N/A"}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span className="font-medium">{reservation.persons}</span>
                      <span className="text-gray-500 ml-1">
                        {Number.parseInt(reservation.persons) === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                    <button
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No reservations found</p>
          )}
        </div>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedContact.name}</h3>
                <p className="text-gray-600">{selectedContact.email}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">Received: {new Date(selectedContact.createdAt).toLocaleString()}</p>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReservation && <ReservationDetailModal />}
      {showNewReservationsPopup && <NewReservationsPopup />}
      {showBlockTimeSlotModal && (
        <BlockTimeSlotModal
          isOpen={showBlockTimeSlotModal}
          onClose={() => setShowBlockTimeSlotModal(false)}
          onBlock={blockTimeSlot}
        />
      )}
    </div>
  )
}

export default DashboardPage

