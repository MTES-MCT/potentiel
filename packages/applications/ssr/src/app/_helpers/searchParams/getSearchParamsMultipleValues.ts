import { parseToArray } from '../optionalStringArray';

export const getSearchParamsMultipleValues = (searchParams: URLSearchParams, name: string) => {
  const value = searchParams.getAll(name);

  if (value.length > 0 && value[0] !== '') {
    return parseToArray(value[0]);
  }

  return undefined;
};
