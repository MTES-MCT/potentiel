import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

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
  afficherParagrapheInstallationMiseEnServiceModification: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFP: '',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: 'la prime retenue',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dataFields: commonDataFields,
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
      canGenerateCertificate: true,
    },
  ],
  familles: [],
}

export { autoconsommationMetropole }
