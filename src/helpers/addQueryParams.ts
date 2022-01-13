export const addQueryParams = (url, query) => {
  if (!query) return url

  const queryParams = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') queryParams.set(key, value)
  }

  return url + (url.indexOf('?') === -1 ? '?' : '&') + queryParams.toString()
}
