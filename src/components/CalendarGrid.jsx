import { addMonths, format, subMonths } from 'date-fns'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { buildMonthGrid, toDateKey } from '../utils/date'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CalendarGrid = ({ selectedDate, onSelectDate }) => {
  const monthDays = buildMonthGrid(selectedDate)
  const selectedKey = toDateKey(selectedDate)

  return (
    <section className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSelectDate(subMonths(selectedDate, 1))}
          className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:text-indigo-600 dark:border-slate-600"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-lg font-semibold">{format(selectedDate, 'MMMM yyyy')}</h2>
        <button
          type="button"
          onClick={() => onSelectDate(addMonths(selectedDate, 1))}
          className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:text-indigo-600 dark:border-slate-600"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <p key={day} className="text-center text-xs font-semibold text-slate-500">
            {day}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day) => (
          <button
            key={day.dateKey}
            type="button"
            onClick={() => onSelectDate(day.date)}
            className={`rounded-xl p-2 text-sm transition ${
              day.dateKey === selectedKey
                ? 'bg-indigo-600 text-white'
                : day.isCurrentMonth
                  ? 'bg-white/80 text-slate-700 hover:bg-indigo-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600'
            } ${day.isToday && day.dateKey !== selectedKey ? 'ring-2 ring-indigo-400' : ''}`}
          >
            {format(day.date, 'd')}
          </button>
        ))}
      </div>
    </section>
  )
}

export default CalendarGrid
