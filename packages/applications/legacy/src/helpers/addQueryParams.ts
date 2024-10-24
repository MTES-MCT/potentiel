import querystring from 'querystring';

export const addQueryParams = (url: string, query) => {
  if (!query) return url;
  if (typeof query === 'object' && Object.keys(query).length === 0) return url;
  return url + (url.indexOf('?') === -1 ? '?' : '&') + querystring.stringify(query);
};
