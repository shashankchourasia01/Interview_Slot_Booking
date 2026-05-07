import { useEffect, useState } from 'react'
import { storage } from '../utils/storage'

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = storage.get(storage.keys.theme, null)
    if (savedTheme) return savedTheme === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    storage.set(storage.keys.theme, isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleDarkMode: () => setIsDark((prev) => !prev) }
}
