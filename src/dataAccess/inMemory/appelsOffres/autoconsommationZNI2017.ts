import { AppelOffre } from '../../../entities'
import { commonDataFields, makeParagrapheAchevementForDelai } from './commonDataFields'
import toTypeLiteral from './helpers/toTypeLiteral'

export const autoconsommationZNI2017: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI 2017',
  title:
    '2016/S 242-441979 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - Autoconsommation ZNI 2016/S 242-441979',
  launchDate: 'décembre 2016',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30, '7.1'),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
  paragrapheEngagementIPFP: '3.2.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFP: '3.2.6 et 7.2.2',
  paragrapheClauseCompetitivite: '',
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
      defaultValue: 0,
      column:
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
      value: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
    },
  ],
  periodes: [
    {
      id: '1',
      title: 'première',
      paragrapheAchevement: '6.3',
    },
  ],
  familles: [],
}
