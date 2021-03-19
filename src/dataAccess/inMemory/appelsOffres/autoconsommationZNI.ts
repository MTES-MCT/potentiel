import { AppelOffre } from '../../../entities'
import { commonDataFields, makeParagrapheAchevementForDelai } from './commonDataFields'
import toTypeLiteral from './helpers/toTypeLiteral'

const autoconsommationZNI: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI',
  title:
    '2019/S 113-276257 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées.',
  shortTitle: 'CRE4 - Autoconsommation ZNI 2019/S 113-276257',
  launchDate: 'juin 2019',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 30,
  contenuParagrapheAchevement: makeParagrapheAchevementForDelai(30),
  delaiRealisationTexte: 'trente (30) mois',
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
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
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v0',
      paragrapheAchevement: '6.3',
    },
    {
      id: '2',
      title: 'deuxième',
      isNotifiedOnPotentiel: true,
      certificateTemplate: 'v1',
      paragrapheAchevement: '6.3',
      noteThresholdByFamily: [{ familleId: '', noteThreshold: 32.9 }],
    },
  ],
  familles: [],
}

export { autoconsommationZNI }
