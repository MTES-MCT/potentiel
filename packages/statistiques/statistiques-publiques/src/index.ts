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
  cleanNombreTotalDCRDéposées,
  computeNombreTotalDCRDéposées,
} from './projet/nombreTotalDCRDéposées.statistic';
import {
  cleanPuissanceTotaleMiseEnService,
  computePuissanceTotaleMiseEnService,
} from './projet/puissanceTotaleMiseEnService.stastistic';
import {
  cleanPourcentageProjetAvecDCREtPTF,
  computePourcentageProjetAvecDCREtPTF,
} from './projet/pourcentageProjetAvecDCREtPTF.statistic';
import {
  cleanPourcentageDCRDéposées,
  computePourcentageDCRDéposées,
} from './projet/pourcentageDCRDéposées.statistic';
import {
  cleanPourcentagePTFDéposées,
  computePourcentagePTFDéposées,
} from './projet/pourcentagePTFDéposées.statistic';
import {
  cleanNombreTotalDemande,
  computeNombreTotalDemande,
} from './projet/nombreTotalDemande.statistic';
import {
  cleanNombreDeDemandeParCategorie,
  computeNombreDeDemandeParCategorie,
} from './projet/nombreDeDemandeParCategorie.statistic';
import {
  cleanNombreDeProjetLauréatParAppelOffre,
  computeNombreDeProjetLauréatParAppelOffre,
} from './projet/nombreDeProjetLauréatParAppelOffre.statistic';
import {
  cleanTotalPuissanceParAppelOffre,
  computeTotalPuissanceParAppelOffre,
} from './projet/totalPuissanceParAppelOffre.statistic';
import {
  cleanNombreTotalProjetEnService,
  computeNombreTotalProjetEnService,
} from './projet/nombreTotalProjetEnService.statistic';

export const cleanStatistiquesPubliques = async () => {
  await cleanNombreTotalProjet();
  await cleanNombrePorteurInscrit();
  await cleanNombreParrainage();
  await cleanPourcentageAttestationTéléchargée();
  await cleanPourcentageDesGFPPE2Validées();
  await cleanNombreTotalDCRDéposées();
  await cleanPuissanceTotaleMiseEnService();
  await cleanPourcentageProjetAvecDCREtPTF();
  await cleanPourcentageDCRDéposées();
  await cleanPourcentagePTFDéposées();
  await cleanNombreTotalDemande();
  await cleanNombreDeDemandeParCategorie();
  await cleanNombreDeProjetLauréatParAppelOffre();
  await cleanTotalPuissanceParAppelOffre();
  await cleanNombreTotalProjetEnService();
};

export const computeStatistiquesPubliques = async () => {
  await computeNombreTotalProjet();
  await computeNombrePorteurInscrit();
  await computeNombreParrainage();
  await computePourcentageAttestationTéléchargée();
  await computePourcentageDesGFPPE2Validées();
  await computeNombreTotalDCRDéposées();
  await computePuissanceTotaleMiseEnService();
  await computePourcentageProjetAvecDCREtPTF();
  await computePourcentageDCRDéposées();
  await computePourcentagePTFDéposées();
  await computeNombreTotalDemande();
  await computeNombreDeDemandeParCategorie();
  await computeNombreDeProjetLauréatParAppelOffre();
  await computeTotalPuissanceParAppelOffre();
  await computeNombreTotalProjetEnService();
};
