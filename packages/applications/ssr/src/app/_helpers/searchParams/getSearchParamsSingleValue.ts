export const getSearchParamsSingleValue = (searchParams: URLSearchParams, name: string) => {
  const value = searchParams.get(name);

  if (value) {
    return value;
  }

  return undefined;
};
