import { AppelOffre } from '../../entities'

const fessenheim: AppelOffre = {
  id: 'fessenheim',
  title:
    '2019/S 019-040037 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
  shortTitle: 'Fessenheim',
  launchDate: 'Janvier 2019',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  completePluginRequestParagraph: '6.1',
  designationRemovalParagraph: '5.3 et 6.2',
  ipFpEngagementParagraph: '3.2.6 et 7.1.2',
  periodes: [
    {
      id: '6',
      title: 'sixième'
    }
  ],
  familles: [
    {
      id: '1',
      title: '<100kwc',
      requiresFinancialGuarantee: true
    }
  ]
}

const appelsOffreStatic = [fessenheim]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  }
}

export { appelOffreRepo, appelsOffreStatic }
