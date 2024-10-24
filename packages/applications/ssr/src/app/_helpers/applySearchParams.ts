/**
 * Applies search params to a url.
 * If `url` already has search params, `searchParams` will be merged into them.
 */
export const applySearchParams = (url: string, searchParams: Record<string, string>) => {
  const [path, currentParams] = url.split('?') ?? '';
  const mergedParams = new URLSearchParams(currentParams);
  for (const [key, value] of Object.entries(searchParams)) {
    mergedParams.set(key, value);
  }
  if (mergedParams.size > 0) {
    return `${path}?${new URLSearchParams(mergedParams)}`;
  }
  return url;
};
