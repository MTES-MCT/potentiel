import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const sol: AppelOffre = {
  id: 'CRE4 - Sol',
  title:
    '2016/S 148-268152 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire « Centrale au sol »',
  shortTitle: 'CRE4 - Sol 2016/S 148-268152',
  launchDate: 'Août 2016',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7.2',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  ipFpEngagementParagraph: '3.2.6',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '5.3 et 6.2',
  ipFpEngagementFootnote: '3.2.6 et 7.2.2',
  competitiveClauseParagraph: '2.8',
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
  ],
  familles: [
    {
      id: '1',
      title: '5 MWc – 30 Mwc',
      requiresFinancialGuarantee: true,
    },
    {
      id: '2',
      title: '500kWc - 5MWc',
      requiresFinancialGuarantee: true,
    },
    {
      id: '3',
      title: '500 kWc - 10MWc',
      requiresFinancialGuarantee: true,
    },
  ],
}

export { sol }
