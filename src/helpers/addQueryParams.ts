import querystring from 'querystring'

export const addQueryParams = (url, query) => {
  if (!query) return url
  return url + (url.indexOf('?') === -1 ? '?' : '&') + querystring.stringify(query)
}
