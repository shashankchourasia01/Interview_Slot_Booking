import { format } from 'date-fns'
import EmptyState from './EmptyState'

const UpcomingInterviews = ({ items }) => (
  <section className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
    <h2 className="mb-3 text-lg font-semibold">Upcoming Interviews</h2>
    {items.length === 0 ? (
      <EmptyState
        title="No upcoming interviews"
        subtitle="Bookings that are in future will appear here."
        compact
      />
    ) : (
      <div className="space-y-2">
        {items.slice(0, 5).map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-slate-200 bg-white/70 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/60"
          >
            <p className="font-medium">
              {booking.name} · {booking.company}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {format(new Date(booking.dateKey), 'EEE, MMM d')} · {booking.interviewTime}
            </p>
          </div>
        ))}
      </div>
    )}
  </section>
)

export default UpcomingInterviews
