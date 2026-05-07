const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  onExport,
  onClearAll,
  onRetry,
}) => (
  <section className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name or company"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
      />
      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
      >
        <option value="all">All Slots</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="mine">My Bookings</option>
      </select>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Retry Sync
      </button>
      <button
        type="button"
        onClick={onExport}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-xl border border-red-400 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        Clear All
      </button>
    </div>
  </section>
)

export default SearchFilters
