import { useEffect, useState } from 'react'
import { getCachedHealthHistory, getHealthHistoryData } from '../services/api'

export function useHealthHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getHealthHistoryData()
        if (isMounted) {
          setHistory(Array.isArray(response) ? response : [])
        }
      } catch (loadError) {
        if (isMounted) {
          const cachedHistory = getCachedHealthHistory()
          if (Array.isArray(cachedHistory)) {
            setHistory(cachedHistory)
          } else {
            setError(loadError.message || 'Unable to load history.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    function handleUpdated() {
      loadHistory()
    }

    loadHistory()
    window.addEventListener('health-data-updated', handleUpdated)

    return () => {
      isMounted = false
      window.removeEventListener('health-data-updated', handleUpdated)
    }
  }, [])

  return {
    history,
    isLoading,
    error,
  }
}
