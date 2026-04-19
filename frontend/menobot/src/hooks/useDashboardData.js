import { useEffect, useState } from 'react'
import { getCachedHealthData, getDashboardData } from '../services/api'

function normalizeDashboardData(payload) {
  const pickLatestEntry = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null
    }

    return items[0] || null
  }

  if (Array.isArray(payload)) {
    return pickLatestEntry(payload)
  }

  if (payload?.data && Array.isArray(payload.data)) {
    return pickLatestEntry(payload.data)
  }

  if (payload?.data && typeof payload.data === 'object') {
    return payload.data
  }

  return payload || null
}

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
        const response = await getDashboardData()
        console.log('Dashboard API response:', response)

        if (isMounted) {
          setData(normalizeDashboardData(response))
        }
      } catch (loadError) {
        if (isMounted) {
          const cachedData = getCachedHealthData()

          if (cachedData) {
            setData(normalizeDashboardData(cachedData))
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
