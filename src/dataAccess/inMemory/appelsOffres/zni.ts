import { AppelOffre } from '../../../entities'
import { commonDataFields, makeParagrapheAchevementForDelai } from './commonDataFields'
import toTypeLiteral from './helpers/toTypeLiteral'

const zni: AppelOffre = {
  id: 'CRE4 - ZNI',
  title:
    '2019/S 113-276264 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI 2019/S 113-276264',
  launchDate: 'juin 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(24, '7'),
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFP: '3.3.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.2 et 6.2',
  renvoiEngagementIPFP: '3.3.6 et 7.1',
  paragrapheClauseCompetitivite: '2.8',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  afficherValeurEvaluationCarbone: true,
  afficherPhraseRegionImplantation: true,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  renvoiSoumisAuxGarantiesFinancieres: 'doit être au minimum de 36 mois',
  dataFields: [
    ...commonDataFields,
    {
      field: 'engagementFournitureDePuissanceAlaPointe',
      type: toTypeLiteral('stringEquals'),
      column: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
      value: 'Oui',
    },
    {
      field: 'territoireProjet',
      type: toTypeLiteral('string'),
      column: 'Territoire\n(AO ZNI)',
    },
    {
      // This field is mandatory
      field: 'evaluationCarbone',
      type: toTypeLiteral('number'),
      column:
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
    },
  ],
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v0',
      noteThresholdByFamily: [
        { familleId: '1a', territoire: 'Corse', noteThreshold: 53.4 },
        { familleId: '1a', territoire: 'Guadeloupe', noteThreshold: 56.3 },
        { familleId: '1a', territoire: 'La Réunion', noteThreshold: 30.6 },
        { familleId: '1a', territoire: 'Mayotte', noteThreshold: 34.5 },
        //
        { familleId: '1b', territoire: 'Corse', noteThreshold: 47.2 },
        { familleId: '1b', territoire: 'Guadeloupe', noteThreshold: 54.2 },
        { familleId: '1b', territoire: 'La Réunion', noteThreshold: 61.9 },
        { familleId: '1b', territoire: 'Mayotte', noteThreshold: 13.1 },
        //
        { familleId: '1c', territoire: 'Corse', noteThreshold: 58.2 },
        { familleId: '1c', territoire: 'Guadeloupe', noteThreshold: 77.1 },
        { familleId: '1c', territoire: 'Guyane', noteThreshold: 64.1 },
        { familleId: '1c', territoire: 'La Réunion', noteThreshold: 65.7 },
        { familleId: '1c', territoire: 'Martinique', noteThreshold: 75.9 },
        { familleId: '1c', territoire: 'Mayotte', noteThreshold: 19.6 },
      ],
    },
    {
      id: '2',
      title: 'deuxième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v0',
      noteThresholdByFamily: [
        { familleId: '2a', territoire: 'Corse', noteThreshold: 42.1 },
        { familleId: '2a', territoire: 'Guadeloupe', noteThreshold: 47.2 },
        { familleId: '2a', territoire: 'Guyane', noteThreshold: 18.4 },
        { familleId: '2a', territoire: 'La Réunion', noteThreshold: 33.3 },
        { familleId: '2a', territoire: 'Mayotte', noteThreshold: 16 },
        //
        { familleId: '2b', territoire: 'Guadeloupe', noteThreshold: 41.7 },
        { familleId: '2b', territoire: 'Guyane', noteThreshold: 42.4 },
        { familleId: '2b', territoire: 'La Réunion', noteThreshold: 14.3 },
        { familleId: '2b', territoire: 'Mayotte', noteThreshold: 24.1 },
        //
        { familleId: '2c', territoire: 'Guadeloupe', noteThreshold: 70.4 },
        { familleId: '2c', territoire: 'Guyane', noteThreshold: 57.6 },
        { familleId: '2c', territoire: 'La Réunion', noteThreshold: 17.1 },
        { familleId: '2c', territoire: 'Martinique', noteThreshold: 27.2 },
      ],
    },
    {
      id: '3',
      title: 'troisième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v1',
      noteThresholdByFamily: [
        { familleId: '1a', territoire: 'Corse', noteThreshold: 52.7 },
        { familleId: '1a', territoire: 'Guadeloupe', noteThreshold: 30.6 },
        { familleId: '1a', territoire: 'La Réunion', noteThreshold: 29.9 },
        { familleId: '1a', territoire: 'Martinique', noteThreshold: 18.6 },
        //
        { familleId: '1b', territoire: 'Corse', noteThreshold: 40.4 },
        { familleId: '1b', territoire: 'Guadeloupe', noteThreshold: 35.9 },
        { familleId: '1b', territoire: 'La Réunion', noteThreshold: 42.9 },
        { familleId: '1b', territoire: 'Martinique', noteThreshold: 35.9 },
        //
        { familleId: '1c', territoire: 'Corse', noteThreshold: 80.7 },
        { familleId: '1c', territoire: 'Guadeloupe', noteThreshold: 64.1 },
        { familleId: '1c', territoire: 'La Réunion', noteThreshold: 33.7 },
      ],
    },
    {
      id: '5',
      title: 'cinquième',
      paragrapheAchevement: '6.4',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v1',
      noteThresholdByFamily: [
        { familleId: '1a', territoire: 'Mayotte', noteThreshold: 49.99 },
        { familleId: '1a', territoire: 'Guyane', noteThreshold: 30.64 },
        //
        { familleId: '1b', territoire: 'Mayotte', noteThreshold: 55.62 },
        { familleId: '1b', territoire: 'Guyane', noteThreshold: 34.59 },
        //
        { familleId: '1c', territoire: 'Mayotte', noteThreshold: 21.4 },
        { familleId: '1c', territoire: 'Guyane', noteThreshold: 65.52 },
      ],
    },
  ],
  familles: [
    // 2017 ZNI avec stockage
    {
      id: '1',
      title: '1. 100kWc - 250kWc',
    },
    {
      id: '2',
      title: '2. 250kWc - 1,5MWc',
    },
    {
      id: '3',
      title: '3. 250kWc - 5MWc',
    },
    // 2019 ZNI avec stockage
    {
      id: '1a',
      title: '1a. 100kWc - 500 kWc',
    },
    {
      id: '1b',
      title: '1b. 500 kWc - 1,5MWc',
      garantieFinanciereEnMois: 36,
      soumisAuxGarantiesFinancieres: true,
    },
    {
      id: '1c',
      title: '1c. 500 kWc - 5 MWc',
      garantieFinanciereEnMois: 36,
      soumisAuxGarantiesFinancieres: true,
    },
    // 2019 ZNI sans stockage
    {
      id: '2a',
      title: '2a. 100kWc - 500 kWc',
    },
    {
      id: '2b',
      title: '2b. 500 kWc - 1,5MWc',
      garantieFinanciereEnMois: 36,
      soumisAuxGarantiesFinancieres: true,
    },
    {
      id: '2c',
      title: '2c. 500 kWc - 5 MWc',
      garantieFinanciereEnMois: 36,
      soumisAuxGarantiesFinancieres: true,
    },
  ],
}

export { zni }
