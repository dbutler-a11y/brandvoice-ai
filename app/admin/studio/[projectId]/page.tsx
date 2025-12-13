import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StudioProjectClient from './StudioProjectClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function StudioProjectPage({ params }: PageProps) {
  const { projectId } = await params

  const project = await prisma.studioProject.findUnique({
    where: { id: projectId },
    include: {
      client: {
        select: {
          id: true,
          businessName: true,
        }
      },
      athletes: {
        include: {
          frames: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Parse JSON fields for frames
  const projectWithParsedFrames = {
    ...project,
    athletes: project.athletes.map(athlete => ({
      ...athlete,
      frames: athlete.frames.map(frame => ({
        ...frame,
        externalLinks: frame.externalLinks ? JSON.parse(frame.externalLinks) : [],
        checkpoints: frame.checkpoints ? JSON.parse(frame.checkpoints) : [],
        revisions: frame.revisions ? JSON.parse(frame.revisions) : [],
        notes: frame.notes ? JSON.parse(frame.notes) : [],
      }))
    }))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/studio"
          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Studio
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
            {project.client && (
              <p className="text-sm text-gray-500 mt-2">
                Client:{' '}
                <Link href={`/admin/clients/${project.client.id}`} className="text-blue-600 hover:text-blue-800">
                  {project.client.businessName}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Client Component for interactivity */}
      <StudioProjectClient project={projectWithParsedFrames} />
    </div>
  )
}
