import { useState } from 'react'
import { motion } from 'framer-motion'

const BookingModal = ({ isOpen, slot, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({ name: '', company: '', interviewTime: '' })

  if (!isOpen || !slot) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onConfirm({ ...formData, interviewTime: formData.interviewTime || slot.label })
    setFormData({ name: '', company: '', interviewTime: '' })
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/40 bg-white/90 p-5 shadow-glass dark:border-slate-700 dark:bg-slate-900/90"
      >
        <h3 className="mb-1 text-xl font-semibold">Book Interview Slot</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{slot.label}</p>

        <div className="space-y-3">
          <input
            required
            placeholder="Your name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <input
            required
            placeholder="Company name"
            value={formData.company}
            onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <input
            required
            placeholder="Interview time"
            value={formData.interviewTime || slot.label}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, interviewTime: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Confirm Booking
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default BookingModal
