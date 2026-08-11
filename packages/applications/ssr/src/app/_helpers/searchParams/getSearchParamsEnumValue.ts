import { getSearchParamsSingleValue } from './getSearchParamsSingleValue';

export const getSearchParamsEnumValue = (
  searchParams: URLSearchParams,
  name: string,
  allowedValues: readonly string[],
) => {
  const value = getSearchParamsSingleValue(searchParams, name);

  return value && allowedValues.includes(value) ? value : undefined;
};
