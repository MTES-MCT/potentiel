export const buildUrl = (baseUrl: string, pathname: string, params?: Record<string, string>) => {
  const url = new URL(`${baseUrl}/${pathname}`);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }
  return url;
};
