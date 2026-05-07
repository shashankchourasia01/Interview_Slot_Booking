import { AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import BookingCard from './BookingCard'
import EmptyState from './EmptyState'
import LoadingSkeleton from './LoadingSkeleton'

const SlotList = ({ selectedDate, records, onBook, onCancel, isLoading }) => (
  <section className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Slots for {format(selectedDate, 'EEEE, MMM d')}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Green: available, Red: booked, Yellow: your booking
      </p>
    </div>

    {isLoading ? (
      <LoadingSkeleton />
    ) : records.length === 0 ? (
      <EmptyState title="No matching slots found" subtitle="Try a different search or filter." />
    ) : (
      <div className="grid gap-3">
        <AnimatePresence>
          {records.map((record) => (
            <BookingCard key={record.slot.id} record={record} onBook={onBook} onCancel={onCancel} />
          ))}
        </AnimatePresence>
      </div>
    )}
  </section>
)

export default SlotList
