import { FaCalendarCheck, FaClock, FaList } from 'react-icons/fa'

const StatCard = ({ icon, title, value }) => (
  <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
    <div className="mb-2 text-indigo-500">{icon}</div>
    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
  </div>
)

const StatsSection = ({ totalBookedSlots, upcomingCount, selectedDateLabel }) => (
  <section className="grid gap-3 sm:grid-cols-3">
    <StatCard icon={<FaList />} title="Total Bookings" value={totalBookedSlots} />
    <StatCard icon={<FaClock />} title="Upcoming Interviews" value={upcomingCount} />
    <StatCard icon={<FaCalendarCheck />} title="Selected Date" value={selectedDateLabel} />
  </section>
)

export default StatsSection
