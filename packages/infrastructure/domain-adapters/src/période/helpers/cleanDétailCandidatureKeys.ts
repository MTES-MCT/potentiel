export const cleanDétailCandidatureKeys = (obj: Record<string, string>): Record<string, string> =>
  removeEmptyValues(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key
          .replace(/\n/g, ' ') // Remplace les retours à la ligne restants par un espace simple
          .replace(/ {2,}/g, ' ') // Remplace deux espaces ou plus par un seul espace
          .trim(), // Supprime les espaces en début et fin de chaîne
        value,
      ]),
    ),
  );

const valuesToStrip = ['', 'N/A', '#N/A', '0'];

const removeEmptyValues = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value))
      .map(([key, value]) => [key, value as string]),
  );
