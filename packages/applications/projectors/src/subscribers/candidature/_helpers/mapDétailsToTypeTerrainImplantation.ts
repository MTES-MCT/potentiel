import type { Candidature } from '@potentiel-domain/projet';

export const mapDétailsToTypeTerrainImplantation = (
  value?: string | undefined,
): Candidature.TypeDeTerrainDImplantation | undefined => {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (['1', 'cas 1'].includes(v)) {
    return 'cas 1';
  }
  if (['2', 'cas 2'].includes(v)) {
    return 'cas 2';
  }
  if (['2 bis', '2 bis'].includes(v)) {
    return 'cas 2 bis';
  }
  if (['3', 'cas 3'].includes(v)) {
    return 'cas 3';
  }
  if (['4', 'cas 4', 'cas 4 (ao innovant)'].includes(v)) {
    return 'cas 4';
  }

  // Deux cas ou "cas mixte"
  if (/^cas\s+\d+\s*(?:et|\+)\s*\d+.*$/.test(v) || v === 'cas mixte') {
    return 'cas mixte';
  }
};
