import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const innovation: AppelOffre = {
  id: 'CRE4 - Innovation',
  title:
    '2017/S 051-094731 portant sur la réalisation et l’exploitation d’Installations de production d’électricité innovantes à partir de l’énergie solaire, sans dispositifs de stockage',
  shortTitle: 'CRE4 - Innovation 2017/S 051-094731',
  launchDate: 'Mars 2017',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7.1',
  derogatoryDelayParagraph: '6.3',
  conformityParagraph: '6.5',
  ipFpEngagementParagraph: '',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '5.3',
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
    {
      id: '3',
      title: 'troisième',
    },
  ],
  familles: [
    // La période 1 a les familles 1a, 1b, 2, 3 et 4
    // Les périodes 2 et 3 ont les familles 1 et 2 seulement
    {
      id: '1a',
      title: "Nouvelles conceptions d'intégration",
      requiresFinancialGuarantee: false,
    },
    {
      id: '1b',
      title: 'Autres innovations de composants',
      requiresFinancialGuarantee: false,
    },
    {
      id: '3',
      title:
        "Innovation liée à l'optimisation et à l'exploitation électrique de la centrale",
      requiresFinancialGuarantee: false,
    },
    {
      id: '4',
      title: 'Agrivoltaïsme',
      requiresFinancialGuarantee: false,
    },
    {
      id: '1',
      title: '500 kWc - 5MWc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '2',
      title: '100 kWc - 3MWc',
      requiresFinancialGuarantee: false,
    },
  ],
}

export { innovation }
