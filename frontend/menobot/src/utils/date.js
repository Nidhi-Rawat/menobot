export function parseAppDate(value) {
  if (!value && value !== 0) {
    return null
  }

  let parsedDate

  if (typeof value === 'number') {
    parsedDate = new Date(value < 100000000000 ? value * 1000 : value)
  } else if (typeof value === 'string' && /^\d+$/.test(value)) {
    const numericValue = Number(value)
    parsedDate = new Date(numericValue < 100000000000 ? numericValue * 1000 : numericValue)
  } else {
    parsedDate = new Date(value)
  }

  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2000) {
    return null
  }

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

export function formatReadableDate(value) {
  const parsedDate = parseAppDate(value)
  if (!parsedDate) {
    return '--'
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
