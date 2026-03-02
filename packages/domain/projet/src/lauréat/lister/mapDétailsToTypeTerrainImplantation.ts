/** Format uniformisé attendu en sorti : "cas [numéro] [bis optionnel] et [numéro] [bis optionnel]"" */
export const mapDétailsToTypeTerrainImplantation = (input: string): string => {
  if (!input) return '';

  const cleaned = input
    .replace(/\(.*?\)|\[.*?\]/g, '') // suppression des [] et ()
    .trim()
    .toLowerCase();

  /** suppression du segment "cas" qu'on remettra ensuite */
  const withoutCas = cleaned.startsWith('cas ') ? cleaned.slice(4).trim() : cleaned;
  if (!withoutCas) return '';

  /** découpage en segments, clean et filtrage */
  const tokens = withoutCas
    .split(/\s*(?:\+|et)\s*/i) // segments séparés par "+" ou "et"
    .map((t) => t.trim())
    .filter((t) => /^\d+(\s*bis)?$/i.test(t)) // on ne conserve que les chiffres seuls ou suivis de "bis"
    .map((t) => t.replace(/\s+/g, ' '));

  if (tokens.length === 0) return '';

  return 'cas ' + tokens.join(' et ');
};
