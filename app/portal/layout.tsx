import { createClient } from '@/lib/supabase/server'
import PortalLayoutClient from './PortalLayoutClient'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Fetch user data server-side
  const { data: { user: authUser } } = await supabase.auth.getUser()

  let user = null
  if (authUser) {
    // Fetch additional user data from User table
    const { data: userData } = await supabase
      .from('User')
      .select('name, email, role')
      .eq('id', authUser.id)
      .single()

    user = userData ? {
      id: authUser.id,
      name: userData.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
      email: userData.email || authUser.email || '',
      role: userData.role || 'CLIENT'
    } : {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      role: 'CLIENT'
    }
  }

  return <PortalLayoutClient user={user}>{children}</PortalLayoutClient>
}
