import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAfter } from 'date-fns'
import toast from 'react-hot-toast'
import { TIME_SLOTS } from '../data/timeSlots'
import { isPastSlot, toDateKey } from '../utils/date'
import { BookingContext } from './bookingContextObject'
import {
  clearBookings,
  createBooking,
  deleteBookingById,
  fetchBookingsWithRetry,
} from '../api/bookingsApi'
import { useRealtimeBookings } from '../hooks/useRealtimeBookings'

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isHydrating, setIsHydrating] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [myBookingIds, setMyBookingIds] = useState([])

  const refreshBookings = useCallback(async ({ notifyOnError = false } = {}) => {
    try {
      const rows = await fetchBookingsWithRetry(2)
      setBookings(rows)
    } catch {
      if (notifyOnError) {
        toast.error('Failed to load bookings. Please retry.')
      }
    }
  }, [])

  useEffect(() => {
    const bootstrap = async () => {
      setIsHydrating(true)
      await refreshBookings({ notifyOnError: true })
      setIsHydrating(false)
    }
    bootstrap()
  }, [refreshBookings])

  useRealtimeBookings(refreshBookings)

  const selectedDateKey = toDateKey(selectedDate)

  const slotRecords = useMemo(
    () => {
      const bookingsByTime = bookings
        .filter((entry) => entry.date === selectedDateKey)
        .reduce((acc, entry) => {
          acc[entry.time] = {
            id: entry.id,
            name: entry.name,
            company: entry.company,
            interviewTime: TIME_SLOTS.find((slot) => slot.id === entry.time)?.label ?? entry.time,
            slotLabel: TIME_SLOTS.find((slot) => slot.id === entry.time)?.label ?? entry.time,
            slotStartHour: TIME_SLOTS.find((slot) => slot.id === entry.time)?.startHour ?? null,
            dateKey: entry.date,
            createdAt: entry.created_at,
          }
          return acc
        }, {})

      return TIME_SLOTS.map((slot) => {
        const booking = bookingsByTime[slot.id]
        const mine = booking ? myBookingIds.includes(booking.id) : false
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
    [bookings, filter, myBookingIds, searchTerm, selectedDate, selectedDateKey],
  )

  const bookSlot = async ({ date, slot, name, company }) => {
    const dateKey = toDateKey(date)
    const existingBooking = bookings.some((entry) => entry.date === dateKey && entry.time === slot.id)

    if (existingBooking) {
      toast.error('This slot is already booked.')
      return false
    }

    if (isPastSlot(date, slot.startHour)) {
      toast.error('Past slots cannot be booked.')
      return false
    }

    setIsMutating(true)
    try {
      const created = await createBooking({
        date: dateKey,
        time: slot.id,
        name,
        company,
      })

      setBookings((prev) => {
        if (prev.some((entry) => entry.date === created.date && entry.time === created.time)) return prev
        return [...prev, created]
      })
      setMyBookingIds((prev) => [...new Set([...prev, created.id])])

      toast.success('Interview slot booked successfully.')
      return true
    } catch (error) {
      if (error?.code === '23505') {
        toast.error('This slot was just booked by someone else.')
        await refreshBookings()
      } else {
        toast.error('Booking failed. Please try again.')
      }
      return false
    } finally {
      setIsMutating(false)
    }
  }

  const cancelBooking = async (dateKey, slotId) => {
    const existing = bookings.find((entry) => entry.date === dateKey && entry.time === slotId)
    if (!existing) return

    setIsMutating(true)
    try {
      await deleteBookingById(existing.id)
      setBookings((prev) => prev.filter((entry) => entry.id !== existing.id))
      setMyBookingIds((prev) => prev.filter((id) => id !== existing.id))
      toast.success('Booking canceled.')
    } catch {
      toast.error('Cancel failed. Please try again.')
    } finally {
      setIsMutating(false)
    }
  }

  const clearAllBookings = async () => {
    setIsMutating(true)
    try {
      await clearBookings()
      setBookings([])
      toast.success('All bookings cleared.')
    } catch {
      toast.error('Could not clear bookings.')
    } finally {
      setIsMutating(false)
    }
  }

  const allBookings = useMemo(
    () =>
      bookings
        .map((entry) => {
          const matchingSlot = TIME_SLOTS.find((slot) => slot.id === entry.time)
          return {
            id: entry.id,
            name: entry.name,
            company: entry.company,
            interviewTime: matchingSlot?.label ?? entry.time,
            slotLabel: matchingSlot?.label ?? entry.time,
            slotStartHour: matchingSlot?.startHour ?? null,
            dateKey: entry.date,
            createdAt: entry.created_at,
          }
        })
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
    isHydrating: isHydrating || isMutating,
    retryLoad: () => refreshBookings({ notifyOnError: true }),
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
