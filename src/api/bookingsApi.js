import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const BOOKINGS_TABLE = 'bookings'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ensureConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
}

export const fetchBookings = async () => {
  ensureConfigured()
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .select('id, date, time, name, company, created_at')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (error) throw error
  return data ?? []
}

export const fetchBookingsWithRetry = async (retryCount = 2) => {
  let currentAttempt = 0
  // Exponential backoff retries for transient network/database failures.
  while (currentAttempt <= retryCount) {
    try {
      return await fetchBookings()
    } catch (error) {
      if (currentAttempt === retryCount) throw error
      await sleep(500 * 2 ** currentAttempt)
      currentAttempt += 1
    }
  }
  return []
}

export const createBooking = async ({ date, time, name, company }) => {
  ensureConfigured()
  const payload = { date, time, name, company }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .insert(payload)
    .select('id, date, time, name, company, created_at')
    .single()

  if (error) throw error
  return data
}

export const deleteBookingById = async (id) => {
  ensureConfigured()
  const { error } = await supabase.from(BOOKINGS_TABLE).delete().eq('id', id)
  if (error) throw error
}

export const clearBookings = async () => {
  ensureConfigured()
  const { error } = await supabase.from(BOOKINGS_TABLE).delete().not('id', 'is', null)
  if (error) throw error
}
