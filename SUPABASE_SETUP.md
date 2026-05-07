## Supabase Migration Setup

1. Create a new Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. In Supabase Dashboard, go to `Project Settings -> API`.
4. Copy:
   - Project URL
   - anon public API key
5. Create `.env` at project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

6. Restart dev server:

```bash
npm run dev
```

## Notes

- Realtime sync works across devices through Supabase realtime subscriptions.
- Double booking is prevented by a database-level unique constraint on `(date, time)`.
- UI remains unchanged; only data layer migrated.
