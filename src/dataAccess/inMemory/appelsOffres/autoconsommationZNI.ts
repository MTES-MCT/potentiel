import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const autoconsommationZNI: AppelOffre = {
  id: 'CRE4 - Autoconsommation ZNI',
  title:
    '2016/S 242-441979 portant sur la réalisation et l’exploitation d’Installations de production  d’électricité à partir d’énergies renouvelables en autoconsommation et situées dans les zones non interconnectées.',
  shortTitle: 'CRE4 - Autoconsommation ZNI 2016/S 242-441979',
  launchDate: 'Juin 2019',
  powerUnit: 'kWc',
  monthsBeforeRealisation: 30,
  referencePriceParagraph: '7.2',
  derogatoryDelayParagraph: '6.3',
  conformityParagraph: '6.4',
  ipFpEngagementParagraph: '',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '',
  ipFpEngagementFootnote: '',
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
  ],
  familles: [],
}

export { autoconsommationZNI }
