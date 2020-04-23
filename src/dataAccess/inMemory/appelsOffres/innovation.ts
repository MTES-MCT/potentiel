import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

import toTypeLiteral from './helpers/toTypeLiteral'

const innovation: AppelOffre = {
  id: 'CRE4 - Innovation',
  title:
    '2017/S 051-094731 portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation 2017/S 051-094731',
  launchDate: 'Mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  paragraphePrixReference: '7.1',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFP: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3',
  renvoiEngagementIPFP: '',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dataFields: [
    ...commonDataFields,
    {
      field: 'evaluationCarbone',
      type: toTypeLiteral('orNumberInColumn'),
      defaultValue: -1, // Accept null values
      column:
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
      value: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
    },
  ],
  periodes: [
    {
      id: '1',
      title: 'première',
    },
    {
      id: '2',
      title: 'deuxième',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 71.58 },
        { familleId: '2', noteThreshold: 45.49 },
      ],
      canGenerateCertificate: true,
    },
  ],
  familles: [
    // La période 1 a les familles 1a, 1b, 2, 3 et 4
    // Les périodes 2 et 3 ont les familles 1 et 2 seulement
    {
      id: '1a',
      title: "1a. Nouvelles conceptions d'intégration",
      garantieFinanciereEnMois: 0,
    },
    {
      id: '1b',
      title: '1b. Autres innovations de composants',
      garantieFinanciereEnMois: 0,
    },
    {
      id: '3',
      title:
        "3. Innovation liée à l'optimisation et à l'exploitation électrique de la centrale",
      garantieFinanciereEnMois: 0,
    },
    {
      id: '4',
      title: '4. Agrivoltaïsme',
      garantieFinanciereEnMois: 0,
    },
    {
      id: '1',
      title: '1. 500 kWc - 5MWc',
      garantieFinanciereEnMois: 0,
    },
    {
      id: '2',
      title: '2. 100 kWc - 3MWc',
      garantieFinanciereEnMois: 0,
    },
  ],
}

export { innovation }
