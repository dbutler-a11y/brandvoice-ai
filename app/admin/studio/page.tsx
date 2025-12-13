import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Status configuration
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: 'text-green-700', bgColor: 'bg-green-100' },
  paused: { label: 'Paused', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  completed: { label: 'Completed', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  archived: { label: 'Archived', color: 'text-gray-700', bgColor: 'bg-gray-100' },
}

const projectTypeConfig: Record<string, { label: string; icon: string }> = {
  brand_campaign: { label: 'Brand Campaign', icon: '🎯' },
  product_launch: { label: 'Product Launch', icon: '🚀' },
  seasonal: { label: 'Seasonal', icon: '🗓️' },
  ambassador_program: { label: 'Ambassador Program', icon: '🌟' },
}

const channelConfig: Record<string, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '📸' },
  tiktok: { label: 'TikTok', icon: '🎵' },
  youtube: { label: 'YouTube', icon: '▶️' },
  multi_platform: { label: 'Multi-Platform', icon: '🌐' },
}

export default async function StudioPage() {
  const projects = await prisma.studioProject.findMany({
    include: {
      client: {
        select: {
          id: true,
          businessName: true,
        }
      },
      athletes: {
        include: {
          _count: {
            select: { frames: true }
          }
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Calculate stats
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalAthletes = projects.reduce((sum, p) => sum + p.athletes.length, 0)
  const totalFrames = projects.reduce((sum, p) =>
    sum + p.athletes.reduce((aSum, a) => aSum + a._count.frames, 0), 0
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Athlete Ad Studio</h1>
          <p className="text-gray-600 mt-1">Create and manage athlete storyboards with AI-powered workflows</p>
        </div>
        <Link
          href="/admin/studio/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Projects</div>
          <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Active Projects</div>
          <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Athletes</div>
          <div className="text-2xl font-bold text-gray-900">{totalAthletes}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Frames</div>
          <div className="text-2xl font-bold text-gray-900">{totalFrames}</div>
        </div>
      </div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type / Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Athletes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frames
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => {
                const framesCount = project.athletes.reduce((sum, a) => sum + a._count.frames, 0)
                const status = statusConfig[project.status] || statusConfig.active
                const projectType = projectTypeConfig[project.projectType] || projectTypeConfig.brand_campaign
                const channel = channelConfig[project.primaryChannel] || channelConfig.instagram

                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/studio/${project.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        {project.name}
                      </Link>
                      {project.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {project.client ? (
                        <Link
                          href={`/admin/clients/${project.client.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {project.client.businessName}
                        </Link>
                      ) : (
                        <span className="text-gray-400">
                          {project.brandName || 'No client'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span>{projectType.icon} {projectType.label}</span>
                        <span className="text-gray-500">{channel.icon} {channel.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {project.athletes.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {framesCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first athlete ad studio project to start building storyboards.
          </p>
          <Link
            href="/admin/studio/new"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Project
          </Link>
        </div>
      )}
    </div>
  )
}
