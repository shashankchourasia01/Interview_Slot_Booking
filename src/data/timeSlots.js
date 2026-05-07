import { format, setHours, setMinutes } from 'date-fns'

const START_HOUR = 9
const END_HOUR = 22

export const TIME_SLOTS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
  const startHour = START_HOUR + i
  const endHour = startHour + 1
  const base = new Date()
  const start = setMinutes(setHours(base, startHour), 0)
  const end = setMinutes(setHours(base, endHour), 0)

  return {
    id: `${startHour}:00`,
    startHour,
    endHour,
    label: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
  }
})
