'use client'

import { useState } from 'react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error'
  lastRun: string
  triggerType: 'webhook' | 'schedule' | 'manual'
  integrations: string[]
}

interface DataSource {
  id: string
  name: string
  type: 'google-sheets' | 'airtable'
  url: string
  lastSync: string
  status: 'connected' | 'disconnected' | 'syncing'
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Content Calendar Generator',
    description: 'Automatically generates 30-day content calendar from client briefs',
    status: 'active',
    lastRun: '2 hours ago',
    triggerType: 'webhook',
    integrations: ['Google Sheets', 'Claude AI', 'Airtable']
  },
  {
    id: '2',
    name: 'Script to Video Pipeline',
    description: 'Takes approved scripts and queues them for video generation',
    status: 'active',
    lastRun: '30 minutes ago',
    triggerType: 'schedule',
    integrations: ['Airtable', 'ElevenLabs', 'Synthesia']
  },
  {
    id: '3',
    name: 'Client Onboarding Flow',
    description: 'Automated onboarding sequence when new client signs up',
    status: 'inactive',
    lastRun: '3 days ago',
    triggerType: 'webhook',
    integrations: ['Stripe', 'Google Sheets', 'Email']
  },
  {
    id: '4',
    name: 'Social Media Scheduler',
    description: 'Schedules approved content to social platforms',
    status: 'active',
    lastRun: '1 hour ago',
    triggerType: 'schedule',
    integrations: ['Airtable', 'Buffer', 'Meta API']
  },
  {
    id: '5',
    name: 'Voice Clone Processor',
    description: 'Processes new voice samples and creates clones',
    status: 'error',
    lastRun: '5 hours ago',
    triggerType: 'manual',
    integrations: ['Google Drive', 'ElevenLabs']
  }
]

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Content Pipeline Master',
    type: 'google-sheets',
    url: 'https://docs.google.com/spreadsheets/d/xxx',
    lastSync: '5 minutes ago',
    status: 'connected'
  },
  {
    id: '2',
    name: 'Client Database',
    type: 'airtable',
    url: 'https://airtable.com/xxx',
    lastSync: '2 minutes ago',
    status: 'connected'
  },
  {
    id: '3',
    name: 'Video Assets Tracker',
    type: 'airtable',
    url: 'https://airtable.com/yyy',
    lastSync: '10 minutes ago',
    status: 'syncing'
  },
  {
    id: '4',
    name: 'Script Templates',
    type: 'google-sheets',
    url: 'https://docs.google.com/spreadsheets/d/yyy',
    lastSync: '1 hour ago',
    status: 'connected'
  }
]

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<'workflows' | 'datasources' | 'logs'>('workflows')
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'syncing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
      case 'schedule':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'manual':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Hub</h1>
          <p className="text-gray-600 mt-1">Manage n8n workflows, Google Sheets, and Airtable integrations</p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://prayai.app.n8n.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open n8n
          </a>
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Workflow
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockWorkflows.filter(w => w.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Executions Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Connected Sources</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockDataSources.filter(d => d.status === 'connected').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Errors (24h)</p>
              <p className="text-2xl font-bold text-red-600 mt-1">2</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'workflows', label: 'Workflows', count: mockWorkflows.length },
            { id: 'datasources', label: 'Data Sources', count: mockDataSources.length },
            { id: 'logs', label: 'Execution Logs', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {mockWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {getTriggerIcon(workflow.triggerType)}
                      <span className="capitalize">{workflow.triggerType}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last run: {workflow.lastRun}
                    </div>
                    <div className="flex gap-1">
                      {workflow.integrations.map((integration, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Sources Tab */}
      {activeTab === 'datasources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockDataSources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    source.type === 'google-sheets' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {source.type === 'google-sheets' ? (
                      <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                        <path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{source.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{source.type.replace('-', ' ')}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last synced: {source.lastSync}</span>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Sync Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Source Card */}
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-5 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50/50 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Connect New Source</p>
              <p className="text-xs text-gray-500 mt-1">Google Sheets or Airtable</p>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                <option>All Workflows</option>
                {mockWorkflows.map(w => (
                  <option key={w.id}>{w.name}</option>
                ))}
              </select>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                <option>All Statuses</option>
                <option>Success</option>
                <option>Error</option>
                <option>Running</option>
              </select>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Export Logs
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { time: '2 min ago', workflow: 'Content Calendar Generator', status: 'success', duration: '4.2s' },
              { time: '15 min ago', workflow: 'Social Media Scheduler', status: 'success', duration: '2.8s' },
              { time: '32 min ago', workflow: 'Script to Video Pipeline', status: 'success', duration: '12.4s' },
              { time: '1 hour ago', workflow: 'Content Calendar Generator', status: 'success', duration: '3.9s' },
              { time: '2 hours ago', workflow: 'Voice Clone Processor', status: 'error', duration: '45.2s' },
              { time: '3 hours ago', workflow: 'Social Media Scheduler', status: 'success', duration: '3.1s' },
            ].map((log, idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{log.workflow}</p>
                    <p className="text-xs text-gray-500">{log.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{log.duration}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
        <p className="text-purple-100 text-sm mb-4">Common automation tasks at your fingertips</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Generate Scripts', icon: '📝' },
            { label: 'Sync Content Calendar', icon: '📅' },
            { label: 'Process Voice Samples', icon: '🎙️' },
            { label: 'Schedule Posts', icon: '📱' },
          ].map((action, idx) => (
            <button
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-left hover:bg-white/20 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <p className="text-sm font-medium mt-2">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
