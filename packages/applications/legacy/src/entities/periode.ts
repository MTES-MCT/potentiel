import { AppelOffre } from '@potentiel-domain/appel-offre';

export const isNotifiedPeriode = (
  periode: AppelOffre.Periode,
): periode is AppelOffre.Periode & AppelOffre.NotifiedPeriode => {
  return periode.type !== 'legacy';
};
