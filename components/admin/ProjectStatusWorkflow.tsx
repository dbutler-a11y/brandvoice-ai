'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'

export type ProjectStatus =
  | 'discovery'
  | 'onboarding'
  | 'avatar-creation'
  | 'scriptwriting'
  | 'video-production'
  | 'qa-review'
  | 'delivered'
  | 'ongoing'

export interface WorkflowStep {
  id: ProjectStatus
  label: string
  description: string
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'discovery',
    label: 'Discovery & Booking',
    description: 'Initial consultation and contract signing',
  },
  {
    id: 'onboarding',
    label: 'Onboarding & Voice Selection',
    description: 'Client intake and voice preference selection',
  },
  {
    id: 'avatar-creation',
    label: 'Avatar & Voice Creation',
    description: 'Custom avatar design and voice cloning',
  },
  {
    id: 'scriptwriting',
    label: 'Scriptwriting',
    description: 'Script creation and client approval',
  },
  {
    id: 'video-production',
    label: 'Video Production',
    description: 'Video generation and editing',
  },
  {
    id: 'qa-review',
    label: 'Quality Assurance',
    description: 'Final review and quality checks',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Project delivered to client',
  },
  {
    id: 'ongoing',
    label: 'Ongoing (Monthly)',
    description: 'Recurring monthly content production',
  },
]

interface ProjectStatusWorkflowProps {
  clientId: string
  currentStatus: ProjectStatus
  projectStartDate?: Date | string | null
  projectDeliveryDate?: Date | string | null
  statusHistory?: Record<string, Date | string>
  onStatusUpdate?: () => void
}

export default function ProjectStatusWorkflow({
  clientId,
  currentStatus,
  projectStartDate,
  projectDeliveryDate,
  statusHistory = {},
  onStatusUpdate,
}: ProjectStatusWorkflowProps) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const currentStepIndex = WORKFLOW_STEPS.findIndex((step) => step.id === currentStatus)

  const handleAdvanceStatus = async () => {
    if (currentStepIndex === WORKFLOW_STEPS.length - 1) {
      alert('Project is already at the final stage (Ongoing)')
      return
    }

    const nextStep = WORKFLOW_STEPS[currentStepIndex + 1]

    if (!confirm(`Advance project status to "${nextStep.label}"?`)) {
      return
    }

    setUpdating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStep.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }

      setSuccessMessage(`Successfully advanced to ${nextStep.label}`)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)

      // Notify parent component to refresh data
      if (onStatusUpdate) {
        onStatusUpdate()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Project Status Workflow</h2>
          {currentStepIndex < WORKFLOW_STEPS.length - 1 && (
            <button
              onClick={handleAdvanceStatus}
              disabled={updating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {updating ? 'Updating...' : 'Advance to Next Step'}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Track and manage the project lifecycle from discovery to ongoing production
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Project Timeline Info */}
      {(projectStartDate || projectDeliveryDate) && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            {projectStartDate && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">Started:</span> {formatDate(projectStartDate)}
                </span>
              </div>
            )}
            {projectDeliveryDate && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">Target Delivery:</span>{' '}
                  {formatDate(projectDeliveryDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workflow Steps */}
      <div className="space-y-4">
        {WORKFLOW_STEPS.map((step, index) => {
          const stepStatus = getStepStatus(index)
          const completedDate = statusHistory[step.id]

          return (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {index < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-8 ${
                    stepStatus === 'completed' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Step Card */}
              <div
                className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                  stepStatus === 'current'
                    ? 'border-indigo-600 bg-indigo-50'
                    : stepStatus === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Step Icon */}
                <div className="flex-shrink-0">
                  {stepStatus === 'completed' ? (
                    <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : stepStatus === 'current' ? (
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-lg">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          stepStatus === 'current'
                            ? 'text-indigo-900'
                            : stepStatus === 'completed'
                            ? 'text-green-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {step.label}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          stepStatus === 'current'
                            ? 'text-indigo-700'
                            : stepStatus === 'completed'
                            ? 'text-green-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.description}
                      </p>
                      {completedDate && stepStatus === 'completed' && (
                        <p className="text-xs text-green-600 mt-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed {formatDate(completedDate)}
                        </p>
                      )}
                    </div>
                    {stepStatus === 'current' && (
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Click &quot;Advance to Next Step&quot; to move the project forward. Each status change is timestamped
          automatically.
        </p>
      </div>
    </div>
  )
}
