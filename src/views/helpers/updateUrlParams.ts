type UpdateUrlParams = { [key: string]: string | null };

/**
 * @deprecated this method is temporary and will be replace soon when we will use a SPA which use a react router
 */
export const updateUrlParams = (params?: UpdateUrlParams) => {
  if (!params || Object.keys(params).length === 0) {
    return;
  }

  const { location } = window;
  const { search, origin, pathname } = location;

  const queryString = new URLSearchParams(search);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      queryString.delete(key);
    } else {
      queryString.set(key, value);
    }
  });

  queryString.delete('error');
  queryString.delete('success');

  location.replace(`${origin}${pathname}?&${queryString.toString()}`);
};
