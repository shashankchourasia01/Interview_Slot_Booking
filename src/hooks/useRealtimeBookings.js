import { useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export const useRealtimeBookings = (onRealtimeEvent) => {
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => onRealtimeEvent(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onRealtimeEvent])
}
