import { useEffect, useState } from 'react'
import { getCachedHealthData, getLatestHealthData } from '../services/api'

export function useDashboardData() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getLatestHealthData()
        if (isMounted) {
          setData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          const cachedData = getCachedHealthData()

          if (cachedData) {
            setData(cachedData)
            setError('')
          } else {
            setError(loadError.message || 'Failed to load dashboard data.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    function handleHealthDataUpdated() {
      loadData()
    }

    loadData()
    window.addEventListener('health-data-updated', handleHealthDataUpdated)

    return () => {
      isMounted = false
      window.removeEventListener('health-data-updated', handleHealthDataUpdated)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
  }
}
