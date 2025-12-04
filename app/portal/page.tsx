import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  totalVideos: number
  totalScripts: number
  lastUpload: string | null
}

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

  // Fetch client links for this user
  const { data: clientUsers } = await supabase
    .from('ClientUser')
    .select('clientId, client:Client(id, businessName)')
    .eq('userId', user.id)

  // Extract client IDs - cu.client could be an array or single object from Supabase join
  const clientIds = clientUsers?.map(cu => {
    const client = cu.client as unknown as { id: string; businessName: string } | { id: string; businessName: string }[]
    if (Array.isArray(client)) {
      return client[0]?.id
    }
    return client?.id
  }).filter(Boolean) as string[] || []

  let stats: DashboardStats = {
    totalVideos: 0,
    totalScripts: 0,
    lastUpload: null
  }

  // Only query stats if user has linked clients
  if (clientIds.length > 0) {
    // Fetch video count from ClientAsset
    const { count: videoCount } = await supabase
      .from('ClientAsset')
      .select('*', { count: 'exact', head: true })
      .in('clientId', clientIds)
      .ilike('fileType', 'video%')

    // Fetch script count
    const { count: scriptCount } = await supabase
      .from('Script')
      .select('*', { count: 'exact', head: true })
      .in('clientId', clientIds)

    // Fetch most recent upload
    const { data: recentAsset } = await supabase
      .from('ClientAsset')
      .select('uploadedAt')
      .in('clientId', clientIds)
      .order('uploadedAt', { ascending: false })
      .limit(1)
      .single()

    stats = {
      totalVideos: videoCount || 0,
      totalScripts: scriptCount || 0,
      lastUpload: recentAsset?.uploadedAt || null
    }
  }

  const hasClients = clientIds.length > 0
  const userName = userProfile?.name || user.email?.split('@')[0] || 'there'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          {hasClients
            ? 'Access your AI spokesperson videos and scripts below'
            : 'Your account has been created! An admin will link your client account shortly.'}
        </p>
      </div>

      {/* No Clients Message */}
      {!hasClients && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Account Setup in Progress</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your portal access is being configured. Once complete, you will be able to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>View and download your AI spokesperson videos</li>
                  <li>Access your custom scripts</li>
                  <li>Track your content library</li>
                </ul>
                <p className="mt-3">If you have questions, please contact your account manager.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview - Only show if user has clients */}
      {hasClients && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalVideos}
                </p>
                {stats.totalVideos === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No videos yet</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scripts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalScripts}
                </p>
                {stats.totalScripts === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No scripts yet</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Upload</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {stats.lastUpload ? new Date(stats.lastUpload).toLocaleDateString() : 'No uploads yet'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Only show if user has clients */}
      {hasClients && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Videos Card */}
          <Link
            href="/portal/videos"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  My Videos
                </h3>
                <p className="text-sm text-gray-600">View and download videos</p>
              </div>
            </div>
          </Link>

          {/* My Scripts Card */}
          <Link
            href="/portal/scripts"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  My Scripts
                </h3>
                <p className="text-sm text-gray-600">View and copy scripts</p>
              </div>
            </div>
          </Link>

          {/* Account Settings Card */}
          <Link
            href="/portal"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  Account Settings
                </h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </div>
          </Link>
          </div>
        </div>
      )}

      {/* Recent Activity - Only show if user has clients */}
      {hasClients && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {stats.totalVideos === 0 && stats.totalScripts === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-sm">No activity yet</p>
                <p className="text-gray-400 text-xs mt-1">Your recent videos and scripts will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">New video uploaded</p>
                <p className="text-xs text-gray-600">FAQ_Script_05.mp4 was added to your library</p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">Scripts generated</p>
                <p className="text-xs text-gray-600">30-day script pack ready for review</p>
                <p className="text-xs text-gray-400 mt-1">5 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">Account created</p>
                <p className="text-xs text-gray-600">Welcome to BrandVoice.AI!</p>
                <p className="text-xs text-gray-400 mt-1">1 week ago</p>
              </div>
            </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
