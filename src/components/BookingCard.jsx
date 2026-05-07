import { motion } from 'framer-motion'

const BookingCard = ({ record, onBook, onCancel }) => {
  const { slot, booking, mine, past } = record

  const classes = booking
    ? mine
      ? 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30'
      : 'bg-red-100 border-red-400 dark:bg-red-900/30'
    : past
      ? 'bg-slate-100 border-slate-300 opacity-70 dark:bg-slate-800 dark:border-slate-700'
      : 'bg-green-100 border-green-400 hover:-translate-y-0.5 dark:bg-green-900/20'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition ${classes}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-semibold">{slot.label}</p>
        {booking ? (
          <span className="rounded-full bg-white/70 px-2 py-1 text-xs dark:bg-slate-900/40">
            {mine ? 'Your Booking' : 'Booked'}
          </span>
        ) : (
          <span className="rounded-full bg-white/70 px-2 py-1 text-xs dark:bg-slate-900/40">
            {past ? 'Closed' : 'Available'}
          </span>
        )}
      </div>

      {booking ? (
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Name:</span> {booking.name}
          </p>
          <p>
            <span className="font-medium">Company:</span> {booking.company}
          </p>
          <p>
            <span className="font-medium">Interview Time:</span> {booking.interviewTime}
          </p>
          {mine && (
            <button
              type="button"
              onClick={() => onCancel(slot.id)}
              className="mt-2 rounded-lg border border-red-400 px-3 py-1 text-xs text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Cancel Booking
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onBook(slot)}
          disabled={past}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          Book Slot
        </button>
      )}
    </motion.div>
  )
}

export default BookingCard
