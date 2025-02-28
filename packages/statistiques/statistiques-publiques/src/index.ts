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
import {
  cleanProjetLauréatParDépartement,
  computeProjetLauréatParDépartement,
} from './projet/projetLauréatParDépartement.statistic';
import {
  cleanUtilisateurCréation,
  computeUtilisateurCréation,
} from './projet/utilisateurCréation.statistic';
import {
  cleanTotalPuissanceProjetAvecMainlevéeAccordée,
  computeTotalPuissanceProjetAvecMainlevéeAccordée,
} from './projet/totalPuissanceProjetAvecMainlevéeAccordée.statistic';
import {
  cleanNombreTotalMainlevéeAccordée,
  computeNombreTotalMainlevéeAccordée,
} from './projet/nombreTotalMainlevéeAccordée.statistic';
import {
  cleanNombreTotalProjetAyantTransmisAttestationConformité,
  computeNombreTotalProjetAyantTransmisAttestationConformité,
} from './projet/nombreTotalProjetAyantTransmisAttestationConformité.statistic';
import {
  cleanNombreTotalProjetCRE4AyantTransmisAttestationConformité,
  computeNombreTotalProjetCRE4AyantTransmisAttestationConformité,
} from './projet/nombreTotalProjetCRE4AyantTransmisAttestationConformité.statistic';
import {
  cleanNombreTotalProjetPPE2AyantTransmisAttestationConformité,
  computeNombreTotalProjetPPE2AyantTransmisAttestationConformité,
} from './projet/nombreTotalProjetPPE2AyantTransmisAttestationConformité.statistic';

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
  await cleanProjetLauréatParDépartement();
  await cleanUtilisateurCréation();
  await cleanTotalPuissanceProjetAvecMainlevéeAccordée();
  await cleanNombreTotalMainlevéeAccordée();
  await cleanNombreTotalProjetAyantTransmisAttestationConformité();
  await cleanNombreTotalProjetCRE4AyantTransmisAttestationConformité();
  await cleanNombreTotalProjetPPE2AyantTransmisAttestationConformité();
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
  await computeProjetLauréatParDépartement();
  await computeUtilisateurCréation();
  await computeTotalPuissanceProjetAvecMainlevéeAccordée();
  await computeNombreTotalMainlevéeAccordée();
  await computeNombreTotalProjetAyantTransmisAttestationConformité();
  await computeNombreTotalProjetCRE4AyantTransmisAttestationConformité();
  await computeNombreTotalProjetPPE2AyantTransmisAttestationConformité();
};
