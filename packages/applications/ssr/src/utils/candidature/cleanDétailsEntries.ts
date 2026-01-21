import { removeEmptyValues } from './removeEmptyValues';

export const cleanDétailsEntries = (obj: Record<string, string>): Record<string, string> =>
  removeEmptyValues(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key.replace(/\n/g, ' ').trim(), value]),
    ),
  );
