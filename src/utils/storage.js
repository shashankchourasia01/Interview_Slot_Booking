const STORAGE_KEYS = {
  theme: 'interview_slot_theme_v1',
}

export const storage = {
  keys: STORAGE_KEYS,
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem(key)
  },
}
