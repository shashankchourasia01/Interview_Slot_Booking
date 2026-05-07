import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

export const toDateKey = (date) => format(date, 'yyyy-MM-dd')

export const buildMonthGrid = (monthDate) => {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = []
  let day = gridStart

  while (isBefore(day, gridEnd) || isSameDay(day, gridEnd)) {
    days.push({
      date: day,
      dateKey: toDateKey(day),
      isCurrentMonth: day.getMonth() === monthDate.getMonth(),
      isToday: isToday(day),
    })
    day = addDays(day, 1)
  }

  return days
}

export const isPastSlot = (selectedDate, slotHour) => {
  const now = new Date()
  const slotStart = new Date(selectedDate)
  slotStart.setHours(slotHour, 0, 0, 0)

  return isAfter(now, slotStart)
}
