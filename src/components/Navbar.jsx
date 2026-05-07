import { FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = ({ isDark, onToggleDarkMode }) => (
  <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/70">
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Parakeet AI
        </p>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Interview Slot Booking
        </h1>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="rounded-xl border border-slate-300 bg-white/70 p-2 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
        onClick={onToggleDarkMode}
        type="button"
        aria-label="Toggle dark mode"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </motion.button>
    </div>
  </header>
)

export default Navbar
