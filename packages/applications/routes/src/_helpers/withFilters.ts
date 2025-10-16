export const withFilters =
  <TFilters extends Record<string, string[] | string | undefined>>(base: string) =>
  (filters?: TFilters) => {
    const searchParams = new URLSearchParams();
    filters ??= {} as TFilters;
    for (const key of Object.keys(filters)) {
      const value = filters[key];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.set(key, value);
        }
      }
    }

    return `${base}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  };
