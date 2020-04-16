import { AppelOffre } from '../../../entities'
import { commonDataFields } from './commonDataFields'

const fessenheim: AppelOffre = {
  id: 'Fessenheim',
  title:
    '2019/S 019-040037 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
  shortTitle: 'Fessenheim 2019/S 019-040037',
  launchDate: 'Janvier 2019',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  completePluginRequestFootnote: '6.1',
  designationRemovalFootnote: '5.3 et 6.2',
  ipFpEngagementParagraph: '3.2.6',
  ipFpEngagementFootnote: '3.2.6 et 7.1.2',
  dataFields: commonDataFields,
  periodes: [
    {
      id: '1',
      title: 'première',
    },
    {
      id: '2',
      title: 'deuxième',
      noteThresholdByFamily: [
        { familleId: '1', noteThreshold: 69.34 },
        { familleId: '3', noteThreshold: 1.52 },
      ],
      canGenerateCertificate: true,
    },
  ],
  familles: [
    {
      id: '1',
      title: '1',
      requiresFinancialGuarantee: true,
    },
    {
      id: '2',
      title: '2',
      requiresFinancialGuarantee: true,
    },
    {
      id: '3',
      title: '3',
      requiresFinancialGuarantee: false,
    },
  ],
}

export { fessenheim }
