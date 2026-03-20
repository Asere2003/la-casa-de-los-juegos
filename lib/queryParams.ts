export function buildQueryString(
  current: Record<string, string | undefined>,
  updates: Record<string, string | undefined | null>
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(current)) {
    if (value) params.set(key, value)
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}