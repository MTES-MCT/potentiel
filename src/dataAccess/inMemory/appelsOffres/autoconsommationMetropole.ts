import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'
import toTypeLiteral from './helpers/toTypeLiteral'

const autoconsommationMetropole: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole',
  title:
    '2017/S 054-100223 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'CRE4 - Autoconsommation métropole 2017/S 054-100223',
  launchDate: 'Mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFP: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFP: '',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
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
    },
    {
      id: '3',
      title: 'troisième',
    },
    {
      id: '4',
      title: 'quatrième',
    },
    {
      id: '5',
      title: 'cinquième',
    },
    {
      id: '6',
      title: 'sixième',
    },
    {
      id: '7',
      title: 'septième',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 20.04 }],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v0',
    },
    {
      id: '8',
      title: 'huitième',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 32.04 }],
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v1',
    },
  ],
  familles: [],
}

export { autoconsommationMetropole }
