'use client'

import { PROJECT_STATUS_CONFIG, ProjectStatus } from '../types'

interface ProgressTrackerProps {
  currentStatus: ProjectStatus
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Static ring color mapping (Tailwind can't purge dynamic classes)
const ringColors: Record<ProjectStatus, string> = {
  'discovery': 'ring-gray-600',
  'onboarding': 'ring-blue-600',
  'avatar-creation': 'ring-purple-600',
  'scriptwriting': 'ring-indigo-600',
  'video-production': 'ring-orange-600',
  'qa-review': 'ring-yellow-600',
  'delivered': 'ring-green-600',
  'ongoing': 'ring-teal-600',
  'paused': 'ring-gray-500',
  'disputed': 'ring-red-600'
}

export function ProgressTracker({
  currentStatus,
  showLabels = true,
  size = 'md'
}: ProgressTrackerProps) {
  // Main workflow steps (excluding paused/disputed)
  const steps: ProjectStatus[] = [
    'discovery',
    'onboarding',
    'avatar-creation',
    'scriptwriting',
    'video-production',
    'qa-review',
    'delivered'
  ]

  const currentStepIndex = steps.indexOf(currentStatus)
  const isPaused = currentStatus === 'paused'
  const isDisputed = currentStatus === 'disputed'
  const isOngoing = currentStatus === 'ongoing'

  const sizeClasses = {
    sm: { circle: 'w-6 h-6', icon: 'w-3 h-3', text: 'text-xs' },
    md: { circle: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { circle: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-base' }
  }

  const sizes = sizeClasses[size]

  if (isPaused || isDisputed) {
    const config = PROJECT_STATUS_CONFIG[currentStatus]
    return (
      <div className={`${config.bgColor} rounded-lg p-4 border`}>
        <div className="flex items-center gap-3">
          <div className={`${sizes.circle} rounded-full ${config.bgColor} flex items-center justify-center`}>
            {isPaused ? (
              <svg className={`${sizes.icon} ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className={`${sizes.icon} ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <p className={`font-medium ${config.color}`}>{config.label}</p>
            <p className="text-gray-600 text-sm">{config.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const config = PROJECT_STATUS_CONFIG[step]
          const isCompleted = index < currentStepIndex || isOngoing
          const isCurrent = index === currentStepIndex && !isOngoing

          return (
            <div key={step} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`${sizes.circle} rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isCurrent ? `${config.bgColor} ${config.color} ring-2 ring-offset-2 ${ringColors[step]}` : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`${sizes.text} font-medium`}>{index + 1}</span>
                  )}
                </div>
                {showLabels && (
                  <span className={`absolute -bottom-6 whitespace-nowrap ${sizes.text} ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {config.label}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-1 rounded transition-all ${
                      index < currentStepIndex || isOngoing ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress percentage */}
      <div className={`${showLabels ? 'mt-10' : 'mt-4'} flex justify-between items-center text-sm`}>
        <span className="text-gray-600">Project Progress</span>
        <span className="font-semibold text-gray-900">
          {isOngoing ? '100%' : `${Math.round((currentStepIndex / (steps.length - 1)) * 100)}%`}
        </span>
      </div>
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: isOngoing ? '100%' : `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
