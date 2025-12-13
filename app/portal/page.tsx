import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function PortalDashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/portal/login')
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('User')
    .select('name, email')
    .eq('id', user.id)
    .single()

  const userName = userProfile?.name || user.email?.split('@')[0] || 'there'

  return <DashboardClient userName={userName} />
}
