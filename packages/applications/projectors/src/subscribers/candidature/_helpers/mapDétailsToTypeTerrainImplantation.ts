export const mapDétailsToTypeTerrainImplantation = (input?: string): string | undefined => {
  if (!input) return undefined;

  const cleaned = input
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .trim()
    .toLowerCase();

  const withoutCas = cleaned.startsWith('cas ') ? cleaned.slice(4).trim() : cleaned;

  if (!withoutCas) return undefined;

  const tokens = withoutCas
    .split(/\s*(?:\+|et)\s*/i)
    .map((t) => t.trim())
    .filter((t) => /^\d+(\s*bis)?$/i.test(t))
    .map((t) => t.replace(/\s+/g, ' '));

  if (tokens.length === 0) return undefined;

  if (tokens.length > 1) return 'cas mixte';

  return `cas ${tokens[0]}`;
};
