const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const HEALTH_LATEST_CACHE_KEY = 'menobot-health-latest'
const HEALTH_HISTORY_CACHE_KEY = 'menobot-health-history'
const INSIGHTS_CACHE_KEY = 'menobot-insights'

function writeCache(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Ignore storage failures.
  }
}

function readCache(key) {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : null
  } catch {
    return null
  }
}

async function request(endpoint, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch {
    throw new Error(`Backend server is unavailable at ${API_BASE_URL}.`)
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null
        ? payload.message || 'Something went wrong.'
        : 'Something went wrong.'

    throw new Error(message)
  }

  return payload
}

export function getCachedHealthData() {
  return readCache(HEALTH_LATEST_CACHE_KEY)
}

export function getCachedHealthHistory() {
  return readCache(HEALTH_HISTORY_CACHE_KEY)
}

export function getCachedInsights() {
  return readCache(INSIGHTS_CACHE_KEY)
}

export async function getLatestHealthData() {
  const payload = await request('/api/health/latest')
  writeCache(HEALTH_LATEST_CACHE_KEY, payload)
  return payload
}

export async function getHealthHistoryData() {
  const payload = await request('/api/health/history')
  writeCache(HEALTH_HISTORY_CACHE_KEY, payload)
  return payload
}

export async function getInsightsData() {
  const payload = await request('/api/insights')
  writeCache(INSIGHTS_CACHE_KEY, payload)
  return payload
}

export async function submitPainData(data) {
  const payload = await request('/api/health', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  writeCache(HEALTH_LATEST_CACHE_KEY, payload)
  return payload
}

export async function sendMessage(message, healthContext = {}) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      ...healthContext,
    }),
  })
}

export async function getMealSuggestions(payload) {
  console.log('Sending:', payload)

  return request('/api/meals', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const getDashboardData = getLatestHealthData
export const fetchHealthData = getLatestHealthData
export const submitHealthData = submitPainData
export const sendChatMessage = sendMessage
