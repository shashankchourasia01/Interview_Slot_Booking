import { useEffect, useMemo, useState } from 'react'
import { isAfter } from 'date-fns'
import toast from 'react-hot-toast'
import { TIME_SLOTS } from '../data/timeSlots'
import { isPastSlot, toDateKey } from '../utils/date'
import { storage } from '../utils/storage'
import { BookingContext } from './bookingContextObject'

const getOrCreateProfile = () => {
  const existing = storage.get(storage.keys.profile, null)
  if (existing?.deviceId) return existing

  const profile = {
    deviceId: crypto.randomUUID(),
  }
  storage.set(storage.keys.profile, profile)
  return profile
}

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => storage.get(storage.keys.bookings, {}))
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isHydrating, setIsHydrating] = useState(true)
  const [profile] = useState(getOrCreateProfile)

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrating(false), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    storage.set(storage.keys.bookings, bookings)
  }, [bookings])

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === storage.keys.bookings) {
        const nextBookings = event.newValue ? JSON.parse(event.newValue) : {}
        setBookings(nextBookings)
      }
      if (event.key === storage.keys.theme && event.newValue) {
        const nextTheme = JSON.parse(event.newValue)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      }
    }

    window.addEventListener('storage', onStorageChange)
    return () => window.removeEventListener('storage', onStorageChange)
  }, [])

  const selectedDateKey = toDateKey(selectedDate)

  const slotRecords = useMemo(
    () => {
      const dayBookings = bookings[selectedDateKey] ?? {}
      return TIME_SLOTS.map((slot) => {
        const booking = dayBookings[slot.id]
        const mine = booking?.bookedById === profile.deviceId
        const past = isPastSlot(selectedDate, slot.startHour)
        const searchText = `${booking?.name ?? ''} ${booking?.company ?? ''}`.toLowerCase()
        const searchMatched = !searchTerm || searchText.includes(searchTerm.toLowerCase())

        const passesFilter =
          filter === 'all' ||
          (filter === 'available' && !booking && !past) ||
          (filter === 'booked' && Boolean(booking)) ||
          (filter === 'mine' && mine)

        return {
          slot,
          booking,
          mine,
          past,
          disabled: Boolean(booking) || past,
          hidden: !searchMatched || !passesFilter,
        }
      })
    },
    [bookings, filter, profile.deviceId, searchTerm, selectedDate, selectedDateKey],
  )

  const bookSlot = ({ date, slot, name, company, interviewTime }) => {
    const dateKey = toDateKey(date)
    const existingBooking = bookings[dateKey]?.[slot.id]

    if (existingBooking) {
      toast.error('This slot is already booked.')
      return false
    }

    if (isPastSlot(date, slot.startHour)) {
      toast.error('Past slots cannot be booked.')
      return false
    }

    setBookings((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [slot.id]: {
          id: crypto.randomUUID(),
          name,
          company,
          interviewTime,
          slotLabel: slot.label,
          slotStartHour: slot.startHour,
          dateKey,
          bookedById: profile.deviceId,
          createdAt: new Date().toISOString(),
        },
      },
    }))
    toast.success('Interview slot booked successfully.')
    return true
  }

  const cancelBooking = (dateKey, slotId) => {
    const existing = bookings[dateKey]?.[slotId]
    if (!existing) return

    if (existing.bookedById !== profile.deviceId) {
      toast.error('You can only cancel your own booking.')
      return
    }

    setBookings((prev) => {
      const next = { ...prev }
      const dateBucket = { ...(next[dateKey] || {}) }
      delete dateBucket[slotId]

      if (Object.keys(dateBucket).length === 0) {
        delete next[dateKey]
      } else {
        next[dateKey] = dateBucket
      }

      return next
    })

    toast.success('Booking canceled.')
  }

  const clearAllBookings = () => {
    setBookings({})
    toast.success('All bookings cleared.')
  }

  const allBookings = useMemo(
    () =>
      Object.values(bookings)
        .flatMap((day) => Object.values(day))
        .sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey)),
    [bookings],
  )

  const upcomingBookings = useMemo(
    () =>
      allBookings.filter((booking) => {
        const hour = booking.slotStartHour ?? Number.parseInt(booking.interviewTime, 10)
        const date = new Date(booking.dateKey)
        date.setHours(Number.isNaN(hour) ? 0 : hour, 0, 0, 0)
        return isAfter(date, new Date())
      }),
    [allBookings],
  )

  const exportBookings = () => {
    const blob = new Blob([JSON.stringify(allBookings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `interview-bookings-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Bookings exported.')
  }

  const value = {
    bookings,
    selectedDate,
    selectedDateKey,
    setSelectedDate,
    slotRecords,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    totalBookedSlots: allBookings.length,
    upcomingBookings,
    bookSlot,
    cancelBooking,
    clearAllBookings,
    exportBookings,
    isHydrating,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
