import { AppelOffre } from '@potentiel-domain/appel-offre';

export const petitPVBâtimentPPE2: AppelOffre.AppelOffreReadModel = {
  id: 'PPE2 - Petit PV Bâtiment',
  typeAppelOffre: 'batiment',
  cycleAppelOffre: 'PPE2',
  title: `portant sur la réalisation et l'exploitation d'Installations de production d'électricité à partir de l'énergie solaire en Métropole continentale`, // titre à vérifier
  shortTitle: 'PPE2 - Petit PV Bâtiment',
  launchDate: 'XXX 2025', // à vérifier
  cahiersDesChargesUrl: `TODO`, // à vérifier
  technologie: 'pv',
  unitePuissance: 'MWc',
  délaiRéalisationEnMois: 30, // à vérifier
  delaiRealisationTexte: 'trente (30) mois', // à vérifier
  changement: {
    représentantLégal: {
      informationEnregistrée: true,
    },
    actionnaire: {},
    fournisseur: {},
    délai: {
      demande: true,
      autoritéCompétente: 'dreal',
    },
    producteur: {
      informationEnregistrée: true,
    },
    puissance: {
      informationEnregistrée: true,
      demande: true,
      ratios: {
        min: 0.9, // à vérifier
        max: 1.1, // à vérifier
      },
    },
    recours: {
      demande: true,
    },
    abandon: {
      demande: true,
      autoritéCompétente: 'dreal',
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
    typeGarantiesFinancièresDisponibles: ['consignation', 'avec-date-échéance', 'exemption'],
    soumisAuxGarantiesFinancieres: 'à la candidature', // à vérifier
    renvoiRetraitDesignationGarantieFinancieres: '5.1', // à vérifier
    délaiÉchéanceGarantieBancaireEnMois: 48,
  },
  renvoiEngagementIPFPGPFC: '3.2.7', // à vérifier
  paragrapheClauseCompetitivite: '2.9', // à vérifier
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu", // à vérifier
  tarifOuPrimeRetenueAlt: 'ce prix de référence', // à vérifier
  afficherValeurEvaluationCarbone: true, // à vérifier
  afficherPhraseRegionImplantation: false, // à vérifier
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr', // à vérifier
  doitPouvoirChoisirCDCInitial: true, // à vérifier
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
  },
  addendums: {
    paragrapheRenseignerRaccordementDansPotentiel:
      'renseigner dans votre espace Potentiel la référence de l’affaire de raccordement dans les quatre (4) mois à compter de la présente notification',
    paragrapheRenseignerAttestationConformitéDansPotentiel:
      'par voie dématérialisée dans votre espace Potentiel',
  },
  champsSupplémentaires: {
    puissanceDeSite: 'requis',
    autorisationDUrbanisme: 'requis',
    installateur: 'optionnel',
    installationAvecDispositifDeStockage: 'requis',
    natureDeLExploitation: 'requis',
    coefficientKChoisi: 'requis',
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: 'XXXX', // à vérifier
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' }, // à vérifier
      familles: [],
      cahiersDesChargesModifiésDisponibles: [],
      champsSupplémentaires: {},
      addendums: {
        paragrapheECS:
          "Pour rappel, la conformité de l’autorisation d’urbanisme et  le respect du bilan carbone déclaré dans l’offre, arrondi au multiple de 10 le plus proche conformément au cahier des charges, fait l’objet d’une vérification pour la délivrance de l’attestation de conformité qui est obligatoire pour la prise d'effet du contrat",
        paragraphePrix:
          "Pour rappel, la méthodologie d'évaluation carbone repose désormais uniquement sur les valeurs d'émissions de gaz à effet de serre par pays données aux tableaux 3 de l'annexe 2 du cahier des charges.",
      },
    },
  ],
};
