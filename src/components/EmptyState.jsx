import { FaCalendarTimes } from 'react-icons/fa'

const EmptyState = ({ title, subtitle, compact = false }) => (
  <div
    className={`grid place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center dark:border-slate-700 dark:bg-slate-800/40 ${
      compact ? 'p-4' : 'p-8'
    }`}
  >
    <FaCalendarTimes className="mb-2 text-2xl text-slate-400" />
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
  </div>
)

export default EmptyState
