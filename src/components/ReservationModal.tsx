"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X, Phone, Calendar, Clock, Users, Mail, User, CheckCircle } from "lucide-react"
import { db } from "../firebase/config"
import { collection, addDoc, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore"
import { sendEmail } from '../services/emailService.js'

interface RestaurantStatus {
  isOpen: boolean
  closedDays: string[]
  openingTime: string
  closingTime: string
  specialClosures: {
    date: string
    reason?: string
  }[]
}

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  language: "en" | "pt"
}

const translations: Record<string, any> = {
  en: {
    title: "TABLE RESERVATION",
    contactInfo: "Contact Information",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    reservationDetails: "Reservation Details",
    specialRequests: "Special Requests",
    occasion: "Select an occasion (optional)",
    occasions: {
      birthday: "Birthday",
      anniversary: "Anniversary",
      business: "Business Meal",
      date: "Date Night",
      other: "Other",
    },
    seatingPreference: "Seating Preference",
    seating: {
      noPreference: "No Preference",
      indoor: "Indoor",
      outdoor: "Outdoor",
      window: "Window",
      private: "Private (if available)",
    },
    requests: "Any special requests or dietary requirements?",
    bookButton: "Book a Table",
    submitting: "Submitting...",
    closedDay: "WEDNESDAY CLOSED!",
    closedDayMessage: "Please select another day for your reservation.",
    restaurantClosed: "NOTICE",
    restaurantClosedMessage:
      "The restaurant is currently closed for regular service. You can still make reservations for future dates.",
    largeGroupTitle: "GROUP RESERVATION",
    largeGroupHeading: "Large Group Booking",
    largeGroupMessage:
      "For groups of 7 or more, we require a phone confirmation to ensure we can accommodate your party.",
    callNow: "Call +351 920 221 805",
    goBack: "Go back to reservation form",
    largeGroupWarning: "Groups of 7+ require phone confirmation",
    person: "person",
    people: "people",
    confirmationTitle: "Reservation Confirmed!",
    confirmationMessage: "Your table has been reserved. We look forward to serving you!",
    reservationId: "Reservation ID:",
    date: "Date:",
    time: "Time:",
    partySize: "Party Size:",
    done: "Done",
    loading: "Loading reservation system...",
    errors: {
      nameRequired: "Name is required",
      phoneRequired: "Phone number is required",
      invalidPhone: "Invalid phone number",
      emailRequired: "Email is required",
      invalidEmail: "Invalid email address",
      closed: "We are closed on",
      hours: "Restaurant hours are",
    },
  },
  pt: {
    title: "RESERVA DE MESA",
    contactInfo: "Informações de Contato",
    fullName: "Nome Completo",
    phone: "Número de Telefone",
    email: "Endereço de Email",
    reservationDetails: "Detalhes da Reserva",
    specialRequests: "Pedidos Especiais",
    occasion: "Selecione uma ocasião (opcional)",
    occasions: {
      birthday: "Aniversário",
      anniversary: "Aniversário de Casamento",
      business: "Refeição de Negócios",
      date: "Jantar Romântico",
      other: "Outro",
    },
    seatingPreference: "Preferência de Assento",
    seating: {
      noPreference: "Sem Preferência",
      indoor: "Interior",
      outdoor: "Exterior",
      window: "Janela",
      private: "Privado (se disponível)",
    },
    requests: "Algum pedido especial ou requisito dietético?",
    bookButton: "Reservar uma Mesa",
    submitting: "A submeter...",
    closedDay: "QUARTAS-FEIRAS FECHADO!",
    closedDayMessage: "Por favor, selecione outro dia para sua reserva.",
    restaurantClosed: "AVISO",
    restaurantClosedMessage:
      "O restaurante está atualmente fechado para serviço regular. Você ainda pode fazer reservas para datas futuras.",
    largeGroupTitle: "RESERVA DE GRUPO",
    largeGroupHeading: "Reserva para Grupo Grande",
    largeGroupMessage:
      "Para grupos de 7 ou mais, necessitamos de uma confirmação por telefone para garantir que podemos acomodar o seu grupo.",
    callNow: "Ligar para +351 920 221 805",
    goBack: "Voltar ao formulário de reserva",
    largeGroupWarning: "Grupos de 7+ requerem confirmação por telefone",
    person: "pessoa",
    people: "pessoas",
    confirmationTitle: "Reserva Confirmada!",
    confirmationMessage: "A sua mesa foi reservada. Estamos ansiosos para recebê-lo!",
    reservationId: "ID da Reserva:",
    date: "Data:",
    time: "Hora:",
    partySize: "Tamanho do Grupo:",
    done: "Concluído",
    loading: "Carregando sistema de reservas...",
    errors: {
      nameRequired: "Nome é obrigatório",
      phoneRequired: "Número de telefone é obrigatório",
      invalidPhone: "Número de telefone inválido",
      emailRequired: "Email é obrigatório",
      invalidEmail: "Endereço de email inválido",
      closed: "Estamos fechados às",
      hours: "Horário do restaurante é das",
    },
  },
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, language }) => {
  const text = translations[language]
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date(),
    time: "17:00",
    persons: "2",
    specialRequests: "",
    occasion: "",
    preferredSeating: "no preference",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLargeGroupMessage, setShowLargeGroupMessage] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reservationId, setReservationId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    closedDays: ["Wednesday"],
    openingTime: "17:00",
    closingTime: "22:00",
    specialClosures: [],
  })

  const generateTimeSlots = () => {
    const slots = []
    const opening = restaurantStatus?.openingTime || "17:00"
    const closing = restaurantStatus?.closingTime || "22:00"

    const [openHour, openMinute] = opening.split(":").map((num) => Number.parseInt(num))
    const [closeHour, closeMinute] = closing.split(":").map((num) => Number.parseInt(num))

    const openingTimeMinutes = openHour * 60 + openMinute
    let closingTimeMinutes = closeHour * 60 + closeMinute

    if (closingTimeMinutes < openingTimeMinutes) {
      closingTimeMinutes += 24 * 60
    }

    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ["00", "15", "30", "45"]) {
        const currentTimeMinutes = hour * 60 + Number.parseInt(minute)
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute}`

        if (currentTimeMinutes >= openingTimeMinutes && currentTimeMinutes <= closingTimeMinutes) {
          slots.push(timeValue)
        }
      }
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      setIsLoading(true)
      try {
        const statusDoc = await getDoc(doc(db, "settings", "restaurantStatus"))
        if (statusDoc.exists()) {
          setRestaurantStatus(statusDoc.data() as RestaurantStatus)
        }
      } catch (error) {
        console.error("Error fetching restaurant status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchRestaurantStatus()
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = text.errors.nameRequired
    }

    if (!formData.phone.trim()) {
      newErrors.phone = text.errors.phoneRequired
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = text.errors.invalidPhone
    }

    if (!formData.email.trim()) {
      newErrors.email = text.errors.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = text.errors.invalidEmail
    }

    const dayOfWeek = new Date(formData.date).toLocaleDateString(language === "en" ? "en-US" : "pt-PT", {
      weekday: "long",
    })
    if (restaurantStatus.closedDays?.includes(dayOfWeek)) {
      newErrors.date = `${text.errors.closed} ${dayOfWeek}s`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePersonsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData({ ...formData, persons: value })
    setShowLargeGroupMessage(Number.parseInt(value) > 6)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Number.parseInt(formData.persons) > 6) {
      setShowLargeGroupMessage(true)
      return
    }

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        const nextId = await getNextReservationId()
        const reservationData = {
          reservationId: nextId,
          ...formData,
          date: formData.date.toISOString(),
          status: "unread", // Changed from 'approved' to 'unread' to show notification
          createdAt: new Date().toISOString(),
        }

        // Add reservation to Firestore
        await addDoc(collection(db, "reservations"), reservationData)

        // Send email notification
        try {
          await sendEmail()
          console.log("Email notification sent successfully")
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError)
          // Continue with the reservation process even if email fails
        }

        setReservationId(nextId)
        setShowConfirmation(true)
      } catch (error) {
        console.error("Error submitting reservation:", error)
        alert("Failed to submit reservation. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getNextReservationId = async () => {
    const reservationsRef = collection(db, "reservations")
    const today = new Date()
    const dayMonth = `${String(today.getDate()).padStart(2, "0")}${String(today.getMonth() + 1).padStart(2, "0")}`
    const q = query(reservationsRef, orderBy("reservationId", "desc"))

    const querySnapshot = await getDocs(q)
    const reservationsToday = querySnapshot.docs.filter((doc) =>
      doc.data().reservationId.startsWith(`reservation${dayMonth}`),
    )

    if (reservationsToday.length === 0) {
      return `reservation${dayMonth}01`
    }

    const lastNumber = reservationsToday.length + 1
    return `reservation${dayMonth}${String(lastNumber).padStart(2, "0")}`
  }

  const ConfirmationMessage = () => (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="h-16 w-16 text-amber-500 mx-auto" />
      <h3 className="text-2xl font-bold text-amber-400">{text.confirmationTitle}</h3>
      <div className="bg-black/60 p-6 rounded-lg border border-amber-400/20">
        <p className="text-gray-200 mb-4">{text.confirmationMessage}</p>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="font-medium text-amber-300">{text.reservationId}</span>
            <span className="text-white">{reservationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-amber-300">{text.date}</span>
            <span className="text-white">
              {formData.date.toLocaleDateString(language === "en" ? "en-US" : "pt-PT")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-amber-300">{text.time}</span>
            <span className="text-white">{formData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-amber-300">{text.partySize}</span>
            <span className="text-white">{formData.persons}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-amber-500 text-black font-bold py-3 px-6 rounded-md hover:bg-amber-400 transition-colors"
      >
        {text.done}
      </button>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-black rounded-lg p-8 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto border border-amber-400/20 shadow-2xl text-white">
        {showConfirmation ? (
          <ConfirmationMessage />
        ) : showLargeGroupMessage ? (
          <div className="text-center space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400">{text.largeGroupTitle}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-amber-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-black/60 p-6 rounded-lg border border-amber-400/20">
              <Users className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-400 mb-2">{text.largeGroupHeading}</h3>
              <p className="text-gray-300 mb-4">{text.largeGroupMessage}</p>
              <div className="flex items-center justify-center text-amber-400 font-bold text-xl">
                <Phone className="h-6 w-6 mr-2" />
                <a href="tel:+351920221805" className="hover:underline">
                  {text.callNow}
                </a>
              </div>
            </div>
            <button onClick={() => setShowLargeGroupMessage(false)} className="text-amber-400 hover:underline">
              {text.goBack}
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-10">
            <p className="text-amber-300">{text.loading}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400">{text.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-amber-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {restaurantStatus.closedDays && restaurantStatus.closedDays.includes("Wednesday") && (
              <div className="bg-black/40 border-l-4 border-amber-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-amber-400 font-medium">{text.closedDay}</p>
                    <p className="text-sm text-amber-300">{text.closedDayMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {!restaurantStatus.isOpen && (
              <div className="bg-black/40 border-l-4 border-amber-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-amber-400 font-medium">{text.restaurantClosed}</p>
                    <p className="text-sm text-amber-300">{text.restaurantClosedMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-medium text-amber-300">{text.contactInfo}</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={text.fullName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-amber-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-amber-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder={text.phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="text-amber-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-amber-400" />
                  </div>
                  <input
                    type="email"
                    placeholder={text.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-amber-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="border-t border-amber-400/20 pt-5 space-y-4">
                <h3 className="font-medium text-amber-300">{text.reservationDetails}</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-amber-400" />
                  </div>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
                    minDate={new Date()}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  />
                  {errors.date && <p className="text-amber-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-amber-400" />
                  </div>
                  <select
                    value={formData.persons}
                    onChange={handlePersonsChange}
                    className="w-full pl-10 px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? text.person : text.people}
                      </option>
                    ))}
                  </select>
                  {Number.parseInt(formData.persons) > 6 && (
                    <p className="text-amber-400 text-sm mt-1">{text.largeGroupWarning}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-amber-400/20 pt-5 space-y-4">
                <h3 className="font-medium text-amber-300">{text.specialRequests}</h3>
                <div>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  >
                    <option value="">{text.occasion}</option>
                    <option value="birthday">{text.occasions.birthday}</option>
                    <option value="anniversary">{text.occasions.anniversary}</option>
                    <option value="business">{text.occasions.business}</option>
                    <option value="date">{text.occasions.date}</option>
                    <option value="other">{text.occasions.other}</option>
                  </select>
                </div>

                <div>
                  <select
                    value={formData.preferredSeating}
                    onChange={(e) => setFormData({ ...formData, preferredSeating: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    disabled={isSubmitting}
                  >
                    <option value="no preference">{text.seating.noPreference}</option>
                    <option value="indoor">{text.seating.indoor}</option>
                    <option value="outdoor">{text.seating.outdoor}</option>
                    <option value="window">{text.seating.window}</option>
                    <option value="private">{text.seating.private}</option>
                  </select>
                </div>

                <div>
                  <textarea
                    placeholder={text.requests}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-400/50 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-black/60 text-white"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-black font-bold py-3 px-6 rounded-md hover:bg-amber-400 transition-colors disabled:bg-amber-600 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? text.submitting : text.bookButton}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ReservationModal