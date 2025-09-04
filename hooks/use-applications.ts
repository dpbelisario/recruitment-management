import { useState, useEffect } from 'react'
import type { Application, StatusUpdateRequest, StatusUpdateResponse } from '@/lib/types'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/applications')
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (request: StatusUpdateRequest): Promise<StatusUpdateResponse> => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update application status')
      }

      // Update the local state with the updated application
      setApplications(prev => 
        prev.map(app => 
          app.id === request.id ? data.application : app
        )
      )

      return { success: true, application: data.application }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    updateApplicationStatus
  }
}
