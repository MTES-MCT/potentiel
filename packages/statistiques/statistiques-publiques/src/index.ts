import {
  cleanNombreTotalProjet,
  computeNombreTotalProjet,
} from './projet/nombreTotalProjet.statistic';
import {
  cleanNombreParrainage,
  computeNombreParrainage,
} from './utilisateur/nombreParrainage.statistic';
import {
  cleanNombrePorteurInscrit,
  computeNombrePorteurInscrit,
} from './utilisateur/nombrePorteurInscrit.statistic';

export const cleanStatistiquesPubliques = async () => {
  await cleanNombreTotalProjet();
  await cleanNombrePorteurInscrit();
  await cleanNombreParrainage();
};

export const computeStatistiquesPubliques = async () => {
  await computeNombreTotalProjet();
  await computeNombrePorteurInscrit();
  await computeNombreParrainage();
};
