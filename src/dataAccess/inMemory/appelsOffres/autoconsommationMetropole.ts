import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const autoconsommationMetropole: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole',
  title:
    '2017/S 054-100223 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'CRE4 - Autoconsommation métropole 2017/S 054-100223',
  launchDate: 'Mars 2017',
  powerUnit: 'kWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7.2',
  derogatoryDelayParagraph: '6.3',
  conformityParagraph: '6.5',
  ipFpEngagementParagraph: '',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '',
  ipFpEngagementFootnote: '',
  competitiveClauseParagraph: '2.10',
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
    },
    {
      id: '8',
      title: 'huitième',
    },
    {
      id: '9',
      title: 'neuvième',
    },
    {
      id: '10',
      title: 'dixième',
    },
  ],
  familles: [],
}

export { autoconsommationMetropole }
