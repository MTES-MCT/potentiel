import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const autoconsommationZNI: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI',
  title:
    '2016/S 242-441979 portant sur la réalisation et l’exploitation d’Installations de production  d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées.',
  shortTitle: 'CRE4 - Autoconsommation ZNI 2016/S 242-441979',
  launchDate: 'Juin 2019',
  unitePuissance: 'kWc',
  delaiRealisationEnMois: 30,
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.4',
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
      canGenerateCertificate: true,
    },
  ],
  familles: [],
}

export { autoconsommationZNI }
