import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Use root domain with leading dot to share cookies across www and non-www
        domain: typeof window !== 'undefined' && window.location.hostname.includes('brandvoice.studio')
          ? '.brandvoice.studio'
          : undefined,
        path: '/',
        sameSite: 'lax',
        secure: true,
      }
    }
  )
}
