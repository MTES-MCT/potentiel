import { AppelOffre } from '@potentiel-domain/appel-offre';

export const biométhanePPE2: AppelOffre = {
  id: 'PPE2 - Biométhane',
  typeAppelOffre: 'biométhane',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production de biométhane injecté dans un réseau de gaz naturel.',
  shortTitle: 'PPE2 - Biométhane',
  launchDate: 'février 2024',
  cahiersDesChargesUrl:
    'https://www.cre.fr/documents/Appels-d-offres/appel-d-offres-portant-sur-la-realisation-et-l-exploitation-d-installations-de-production-de-biomethane-injecte-dans-un-reseau-de-gaz-naturel',
  unitePuissance: 'GWh PCS/an',
  delaiRealisationEnMois: 36,
  delaiRealisationTexte: 'trente six (36) mois',
  autoritéCompétenteDemandesDélai: 'dreal',
  decoupageParTechnologie: false,
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.2',
  paragrapheAttestationConformite: '6.4',
  paragrapheEngagementIPFPGPFC: '3.3.10, 4.3 et 6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '',
  renvoiRetraitDesignationGarantieFinancieres: '6.1',
  soumisAuxGarantiesFinancieres: 'à la candidature',
  renvoiEngagementIPFPGPFC: '3.3.10, 4.3 et 6.5',
  paragrapheClauseCompetitivite: '2.13',
  tarifOuPrimeRetenue: 'le tarif',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'gaz-renouvelables-et-bas-carbone@developpement-durable.gouv.fr',
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  changementProducteurPossibleAvantAchèvement: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.1',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2). (...) Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du prélèvement d’une part de la garantie financière. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’Etat aux sanctions du 7.8.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.7',
      dispositions: `Les modifications de la Production annuelle prévisionnelle de l’Installation sont autorisées, sous réserve que la Production annuelle prévisionnelle de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80 %) et cent vingt pourcents (120 %) de la Production annuelle prévisionnelle indiquée dans l’offre, dans la limite du plafond de Production annuelle prévisionnelle de 50 GWh PCS/an spécifié au paragraphe 1.2.2 pour le cas d'une offre entrant dans le volume réservé. Elles doivent faire l’objet d’une information au Préfet.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v2',
      cahierDesCharges: {
        référence: '2023/S 249-790242',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      noteThresholdBy: 'category',
      noteThreshold: {
        volumeReserve: {
          noteThreshold: 11,
          puissanceMax: 50,
        },
        autres: {
          noteThreshold: 99,
        },
      },
      cahiersDesChargesModifiésDisponibles: [],
    },
  ],
  familles: [],
};
