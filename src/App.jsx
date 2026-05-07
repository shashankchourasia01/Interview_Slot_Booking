import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Toaster } from 'react-hot-toast'
import { BookingProvider } from './context/BookingContext'
import { useDarkMode } from './hooks/useDarkMode'
import { useBookings } from './hooks/useBookings'
import Navbar from './components/Navbar'
import StatsSection from './components/StatsSection'
import SearchFilters from './components/SearchFilters'
import CalendarGrid from './components/CalendarGrid'
import SlotList from './components/SlotList'
import BookingModal from './components/BookingModal'
import UpcomingInterviews from './components/UpcomingInterviews'

const AppShell = () => {
  const { isDark, toggleDarkMode } = useDarkMode()
  const {
    selectedDate,
    selectedDateKey,
    setSelectedDate,
    slotRecords,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    totalBookedSlots,
    upcomingBookings,
    bookSlot,
    cancelBooking,
    clearAllBookings,
    exportBookings,
    isHydrating,
  } = useBookings()

  const [activeSlot, setActiveSlot] = useState(null)
  const visibleRecords = useMemo(() => slotRecords.filter((record) => !record.hidden), [slotRecords])

  const onConfirmBooking = (payload) => {
    if (!activeSlot) return
    const saved = bookSlot({
      date: selectedDate,
      slot: activeSlot,
      name: payload.name.trim(),
      company: payload.company.trim(),
      interviewTime: payload.interviewTime.trim(),
    })
    if (saved) setActiveSlot(null)
  }

  const onClearAll = () => {
    if (!window.confirm('Clear all bookings from every date?')) return
    clearAllBookings()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6">
        <StatsSection
          totalBookedSlots={totalBookedSlots}
          upcomingCount={upcomingBookings.length}
          selectedDateLabel={format(selectedDate, 'MMM d')}
        />
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          onExport={exportBookings}
          onClearAll={onClearAll}
        />
        <section className="grid gap-4 lg:grid-cols-[1.1fr,1.3fr,1fr]">
          <CalendarGrid selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <SlotList
            selectedDate={selectedDate}
            records={visibleRecords}
            onBook={setActiveSlot}
            onCancel={(slotId) => cancelBooking(selectedDateKey, slotId)}
            isLoading={isHydrating}
          />
          <UpcomingInterviews items={upcomingBookings} />
        </section>
      </main>
      <BookingModal
        isOpen={Boolean(activeSlot)}
        slot={activeSlot}
        onClose={() => setActiveSlot(null)}
        onConfirm={onConfirmBooking}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#1e293b',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
          },
        }}
      />
    </div>
  )
}

const App = () => (
  <BookingProvider>
    <AppShell />
  </BookingProvider>
)

export default App
