export const mapDétailsToTypeTerrainImplantation = (input: string): string => {
  if (!input) return '';

  const cleaned = input
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .trim()
    .toLowerCase();

  const withoutCas = cleaned.startsWith('cas ') ? cleaned.slice(4).trim() : cleaned;
  if (!withoutCas) return '';

  const tokens = withoutCas
    .split(/\s*(?:\+|et)\s*/i)
    .map((t) => t.trim())
    .filter((t) => /^\d+(\s*bis)?$/i.test(t))
    .map((t) => t.replace(/\s+/g, ' '));

  if (tokens.length === 0) return '';

  return 'cas ' + tokens.join(' et ');
};
