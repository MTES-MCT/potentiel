import {
  cleanNombreTotalProjet,
  computeNombreTotalProjet,
} from './projet/nombreTotalProjet.statistic';

export const cleanStatistiquesPubliques = async () => {
  await cleanNombreTotalProjet();
};

export const computeStatistiquesPubliques = async () => {
  await computeNombreTotalProjet();
};
