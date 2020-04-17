import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const zni: AppelOffre = {
  id: 'CRE4 - ZNI',
  title:
    '2016/S 242-441980 portant sur la réalisation et l’exploitation d’installations de production d’électricité à partir de l’énergie solaire et situées dans les zones non interconnectées',
  shortTitle: 'CRE4 - ZNI 2016/S 242-441980',
  launchDate: 'Juin 2019',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7.1',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  ipFpEngagementParagraph: '3.3.6',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '5.2 et 6.2',
  ipFpEngagementFootnote: '3.3.6 et 7.1',
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
      id: '3',
      title: 'troisième',
    },
    {
      id: '4',
      title: 'quatrième',
    },
  ],
  familles: [
    // 2017 ZNI avec stockage
    {
      id: '1',
      title: '100kWc - 250kWc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '2',
      title: '250kWc - 1,5MWc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '3',
      title: '250kWc - 5MWc',
      requiresFinancialGuarantee: false,
    },
    // 2019 ZNI avec stockage
    {
      id: '1a',
      title: '100kWc - 500 kWc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '1b',
      title: '500 kWc - 1,5MWc',
      requiresFinancialGuarantee: true,
    },
    {
      id: '1c',
      title: '500 kWc - 5 MWc',
      requiresFinancialGuarantee: true,
    },
    // 2019 ZNI sans stockage
    {
      id: '2a',
      title: '100kWc - 500 kWc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '2b',
      title: '500 kWc - 1,5MWc',
      requiresFinancialGuarantee: true,
    },
    {
      id: '2c',
      title: '500 kWc - 5 MWc',
      requiresFinancialGuarantee: true,
    },
  ],
}

export { zni }
