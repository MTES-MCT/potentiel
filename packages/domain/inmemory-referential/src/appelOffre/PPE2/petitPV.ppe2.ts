import { AppelOffre } from '@potentiel-domain/appel-offre';

// TODO vérifier nom : AOS ou Petit PV ?
export const petitPVPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Petit PV',
  typeAppelOffre: 'batiment', // à vérifier
  cycleAppelOffre: 'PPE2', // à vérifier
  title: `portant sur la réalisation et l'exploitation d'Installations de production d'électricité à partir de l'énergie solaire en Métropole continentale`, // titre à vérifier
  shortTitle: 'PPE2 - Petit PV', // à vérifier
  launchDate: 'XXX 2025', // à vérifier
  cahiersDesChargesUrl: `TODO`, // à vérifier
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 30, // à vérifier
  delaiRealisationTexte: 'trente (30) mois', // à vérifier
  délai: { autoritéCompétente: 'dreal' },
  abandon: { autoritéCompétente: 'dreal' },
  changement: {
    représentantLégal: {
      nécessiteInstruction: false,
    },
  },
  paragraphePrixReference: '7', // à vérifier
  paragrapheDelaiDerogatoire: '6.3', // à vérifier
  paragrapheAttestationConformite: '6.5', // à vérifier
  paragrapheEngagementIPFPGPFC: '3.2.7, 4.5 et 6.5.1', // à vérifier
  afficherParagrapheInstallationMiseEnServiceModification: true, // à vérifier
  renvoiModification: '5.2', // à vérifier
  affichageParagrapheECS: true, // à vérifier
  renvoiDemandeCompleteRaccordement: '6.1', // à vérifier
  garantiesFinancières: {
    typeGarantiesFinancièresDisponibles: [
      'consignation',
      'garantie-bancaire',
      // 'exemption', // TODO non existant pour le moment
    ],
    soumisAuxGarantiesFinancieres: 'à la candidature', // à vérifier
    renvoiRetraitDesignationGarantieFinancieres: '5.1', // à vérifier
  },
  renvoiEngagementIPFPGPFC: '3.2.7', // à vérifier
  paragrapheClauseCompetitivite: '2.9', // à vérifier
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu", // à vérifier
  tarifOuPrimeRetenueAlt: 'ce prix de référence', // à vérifier
  afficherValeurEvaluationCarbone: true, // à vérifier
  afficherPhraseRegionImplantation: false, // à vérifier
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr', // à vérifier
  doitPouvoirChoisirCDCInitial: true, // à vérifier
  changementPuissance: {
    ratios: {
      min: 0.9, // à vérifier
      max: 1.1, // à vérifier
    },
  },
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `***** A AJOUTER *****`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.2.3',
      dispositions: `***** A AJOUTER *****`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `***** A AJOUTER *****`,
    },
    // probablement à supprimer, pas de changement d'actionnaire
    texteChangementDActionnariat: {
      référenceParagraphe: '5.2.2',
      dispositions: `***** A AJOUTER *****`,
    },
    texteChangementDeProducteur: {
      référenceParagraphe: `5.2.1`,
      dispositions: `***** A AJOUTER *****`,
    },
    texteIdentitéDuProducteur: {
      référenceParagraphe: `2.4`,
      dispositions: `***** A AJOUTER *****`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '', // à vérifier
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' }, // à vérifier
      familles: [],
      cahiersDesChargesModifiésDisponibles: [],
      champsSupplémentaires: {},
    },
  ],
};
