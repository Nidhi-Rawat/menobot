const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const HEALTH_DATA_CACHE_KEY = 'menobot-health-data'

function writeHealthDataCache(payload) {
  try {
    localStorage.setItem(HEALTH_DATA_CACHE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage failures and keep app usable.
  }
}

export function getCachedHealthData() {
  try {
    const rawValue = localStorage.getItem(HEALTH_DATA_CACHE_KEY)
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
  } catch (error) {
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

export async function getDashboardData() {
  const payload = await request('/api/data')
  writeHealthDataCache(payload)
  return payload
}

export async function submitPainData(data) {
  const payload = await request('/api/data', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  writeHealthDataCache([payload])
  return payload
}

export async function sendMessage(message) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function getMealSuggestions(payload) {
  return request('/api/meals', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const fetchHealthData = getDashboardData
export const submitHealthData = submitPainData
export const sendChatMessage = sendMessage
