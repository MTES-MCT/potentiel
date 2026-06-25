import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { nombresEnToutesLettres } from '@potentiel-domain/inmemory-referential';

export const formatNumber = (n: number, precisionOverride?: number) => {
  const precision = precisionOverride || 100;
  return (Math.round(n * precision) / precision).toString().replace('.', ',');
};

// Retourne le nombre en toutes lettres, suivi de sa valeur entre parenthèses
export const formatterNombreEnToutesLettres = (value: AppelOffre.Nombres) =>
  `${nombresEnToutesLettres[value]} (${value})`;
