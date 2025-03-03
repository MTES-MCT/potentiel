import {
  cleanNombreTotalProjet,
  computeNombreTotalProjet,
} from './projet/nombreTotalProjet.statistic';
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
import {
  cleanPourcentageProjetEnService,
  computePourcentageProjetEnService,
} from './projet/pourcentageProjetEnService.statistic';
import {
  cleanPourcentageProjetCRE4EnService,
  computePourcentageProjetCRE4EnService,
} from './projet/pourcentageProjetCRE4EnService.statistic';
import {
  cleanPourcentageProjetPPE2EnService,
  computePourcentageProjetPPE2EnService,
} from './projet/pourcentageProjetPPE2EnService.statistic';

export const cleanStatistiquesPubliques = async () => {
  await cleanNombreTotalProjet();
  await cleanNombrePorteurInscrit();
  await cleanPourcentageAttestationTéléchargée();
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
  await cleanPourcentageProjetEnService();
  await cleanPourcentageProjetCRE4EnService();
  await cleanPourcentageProjetPPE2EnService();
};

export const computeStatistiquesPubliques = async () => {
  await computeNombreTotalProjet();
  await computeNombrePorteurInscrit();
  await computePourcentageAttestationTéléchargée();
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
  await computePourcentageProjetEnService();
  await computePourcentageProjetCRE4EnService();
  await computePourcentageProjetPPE2EnService();
};
