import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const batiment: AppelOffre = {
  id: 'CRE4 - Bâtiment',
  title:
    '2016/S 174-312851 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments, serres et hangars agricoles et ombrières de parking de puissance comprise entre 100 kWc et 8 MWc »',
  shortTitle: 'CRE4 - Bâtiment 2016/S 174-312851',
  launchDate: 'Septembre 2016',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 20,
  referencePriceParagraph: '7',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  ipFpEngagementParagraph: '3.2.5',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '5.3 et 6.2',
  ipFpEngagementFootnote: '3.2.5 et 7.1.2',
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
    {
      id: '11',
      title: 'onzième',
    },
  ],
  familles: [
    {
      id: '1',
      title: '100 kWc – 500 Mwc',
      requiresFinancialGuarantee: false,
    },
    {
      id: '2',
      title: '500 kWc – 8 MWc',
      requiresFinancialGuarantee: true,
    },
  ],
}

export { batiment }
