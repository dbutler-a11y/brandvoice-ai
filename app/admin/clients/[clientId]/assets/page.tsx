'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import FileUpload from '@/components/admin/FileUpload'
import { listClientFiles, deleteFile } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'

interface Asset {
  name: string
  id: string
  created_at: string
  updated_at: string
  metadata: {
    size: number
    mimetype: string
  }
  fullPath: string
  publicUrl: string
  folder: 'videos' | 'images' | 'documents'
}

export default function ClientAssetsPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const [client, setClient] = useState<{ businessName: string } | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFolder, setActiveFolder] = useState<'videos' | 'images' | 'documents'>('videos')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchClient = useCallback(async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (!response.ok) throw new Error('Failed to fetch client')
      const data = await response.json()
      setClient(data)
    } catch (err) {
      console.error('Error fetching client:', err)
    }
  }, [clientId])

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const allAssets: Asset[] = []

      // Fetch from all folders
      const folders: Array<'videos' | 'images' | 'documents'> = ['videos', 'images', 'documents']

      for (const folder of folders) {
        const files = await listClientFiles(clientId, folder)

        for (const file of files) {
          if (file.name === '.emptyFolderPlaceholder') continue

          const fullPath = `${clientId}/${folder}/${file.name}`

          const { data: urlData } = supabase.storage
            .from('client-assets')
            .getPublicUrl(fullPath)

          allAssets.push({
            name: file.name,
            id: file.id,
            created_at: file.created_at || new Date().toISOString(),
            updated_at: file.updated_at || new Date().toISOString(),
            metadata: file.metadata as { size: number; mimetype: string },
            fullPath,
            publicUrl: urlData.publicUrl,
            folder
          })
        }
      }

      setAssets(allAssets)
    } catch (err) {
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchClient()
    fetchAssets()
  }, [fetchClient, fetchAssets])

  const handleUploadComplete = async () => {
    await fetchAssets()
  }

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`Delete "${asset.name}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(asset.fullPath)
    try {
      const success = await deleteFile(asset.fullPath)
      if (success) {
        await fetchAssets()
      } else {
        alert('Failed to delete file. Please try again.')
      }
    } catch (err) {
      alert('Error deleting file')
      console.error('Delete error:', err)
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (folder: string, mimetype?: string) => {
    if (folder === 'videos' || mimetype?.startsWith('video/')) {
      return (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
    if (folder === 'images' || mimetype?.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }

  const filteredAssets = assets.filter(asset => asset.folder === activeFolder)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <Link href="/admin/clients" className="hover:text-gray-700">
            Clients
          </Link>
          <span>/</span>
          <Link href={`/admin/clients/${clientId}`} className="hover:text-gray-700">
            {client?.businessName || 'Client'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Assets</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Client Assets</h1>
        <p className="text-gray-600 mt-1">
          Manage videos, images, and documents for {client?.businessName || 'this client'}
        </p>
      </div>

      {/* Folder Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {(['videos', 'images', 'documents'] as const).map((folder) => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeFolder === folder
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {folder.charAt(0).toUpperCase() + folder.slice(1)}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  {assets.filter(a => a.folder === folder).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upload {activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}
            </h2>
            <FileUpload
              clientId={clientId}
              folder={activeFolder}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {/* Assets Grid */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Uploaded {activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-2">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-2">
                  {getFileIcon(activeFolder)}
                </div>
                <p className="text-gray-500">No {activeFolder} uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload your first file using the form above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.fullPath}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    {/* Preview */}
                    <div className="mb-3">
                      {asset.folder === 'images' ? (
                        <img
                          src={asset.publicUrl}
                          alt={asset.name}
                          className="w-full h-40 object-cover rounded-md bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
                          {getFileIcon(asset.folder, asset.metadata?.mimetype)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
                        {asset.name}
                      </h3>
                      {asset.metadata?.size && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(asset.metadata.size)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(asset.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <a
                        href={asset.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md text-center transition-colors"
                      >
                        View
                      </a>
                      <a
                        href={asset.publicUrl}
                        download={asset.name}
                        className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md text-center transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(asset)}
                        disabled={deleting === asset.fullPath}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleting === asset.fullPath ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
