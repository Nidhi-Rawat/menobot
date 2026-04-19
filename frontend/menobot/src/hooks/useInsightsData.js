import { useEffect, useState } from 'react'
import { getCachedInsights, getInsightsData } from '../services/api'

export function useInsightsData() {
  const [insightsData, setInsightsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadInsights() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getInsightsData()
        if (isMounted) {
          setInsightsData(response)
        }
      } catch (loadError) {
        if (isMounted) {
          const cachedInsights = getCachedInsights()
          if (cachedInsights) {
            setInsightsData(cachedInsights)
          } else {
            setError(loadError.message || 'Unable to load insights.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    function handleUpdated() {
      loadInsights()
    }

    loadInsights()
    window.addEventListener('health-data-updated', handleUpdated)

    return () => {
      isMounted = false
      window.removeEventListener('health-data-updated', handleUpdated)
    }
  }, [])

  return {
    insightsData,
    isLoading,
    error,
  }
}
