import { FiltersSearchParams } from './filterSearchParams.js';

export const withFilters =
  <TFilters extends Record<string, string[] | string | boolean | undefined>>(base: string) =>
  (filters?: TFilters) => {
    const searchParams = new FiltersSearchParams();
    filters ??= {} as TFilters;
    for (const key of Object.keys(filters)) {
      const value = filters[key];
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v);
        }
      } else if (value) {
        searchParams.set(key, value.toString());
      }
    }

    return `${base}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  };
