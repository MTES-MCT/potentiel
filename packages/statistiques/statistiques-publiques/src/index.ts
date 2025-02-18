import {
  cleanNombreTotalProjet,
  computeNombreTotalProjet,
} from './projet/nombreTotalProjet.statistic';
import {
  cleanPourcentageDesGFPPE2Validées,
  computePourcentageDesGFPPE2Validées,
} from './projet/pourcentageDesGFPPE2Validées.statistic';
import {
  cleanNombreParrainage,
  computeNombreParrainage,
} from './utilisateur/nombreParrainage.statistic';
import {
  cleanPourcentageAttestationTéléchargée,
  computePourcentageAttestationTéléchargée,
} from './projet/pourcentageAttestationTéléchargée.statistic';
import {
  cleanNombrePorteurInscrit,
  computeNombrePorteurInscrit,
} from './utilisateur/nombrePorteurInscrit.statistic';
import {
  cleanNombreTotalDemandeComplèteRaccordementDéposées,
  computeNombreTotalDemandeComplèteRaccordementDéposées,
} from './projet/nombreTotalDemandeComplèteRaccordementDéposées.statistic';

export const cleanStatistiquesPubliques = async () => {
  await cleanNombreTotalProjet();
  await cleanNombrePorteurInscrit();
  await cleanNombreParrainage();
  await cleanPourcentageAttestationTéléchargée();
  await cleanPourcentageDesGFPPE2Validées();
  await cleanNombreTotalDemandeComplèteRaccordementDéposées();
};

export const computeStatistiquesPubliques = async () => {
  await computeNombreTotalProjet();
  await computeNombrePorteurInscrit();
  await computeNombreParrainage();
  await computePourcentageAttestationTéléchargée();
  await computePourcentageDesGFPPE2Validées();
  await computeNombreTotalDemandeComplèteRaccordementDéposées();
};
