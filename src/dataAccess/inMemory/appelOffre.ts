import { AppelOffre } from '../../entities'

const commonDataFields = [
  { field: 'appelOffreId', string: "Appel d'offres" },
  { field: 'periodeId', string: 'Période' },
  { field: 'numeroCRE', string: 'N°CRE' },
  { field: 'familleId', string: 'Famille de candidature' },
  { field: 'nomCandidat', string: 'Candidat' },
  { field: 'nomProjet', string: 'Nom projet' },
  {
    field: 'puissance',
    number:
      'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)'
  },
  {
    field: 'prixReference',
    number:
      'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)'
  },
  {
    field: 'evaluationCarbone',
    number:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)'
  },
  { field: 'note', number: 'Note totale' },
  {
    field: 'nomRepresentantLegal',
    string: 'Nom (personne physique) ou raison sociale (personne morale) :'
  },
  { field: 'email', string: 'Adresse électronique du contact' },
  { field: 'adresseProjet', string: 'N°, voie, lieu-dit' },
  { field: 'codePostalProjet', string: 'CP' },
  { field: 'communeProjet', string: 'Commune' },
  { field: 'departementProjet', string: 'Département' },
  { field: 'regionProjet', string: 'Région' },
  { field: 'classe', string: 'Classé ?' },
  { field: 'motifsElimination', string: "Motif d'élimination" },
  { field: 'fournisseur', string: 'Nom du fabricant \n(Modules ou films)' },
  { field: 'actionnaire', string: 'Nom et prénom du représentant légal' },
  { field: 'producteur', string: 'Nom et prénom du représentant légal' },
  { field: 'notifiedOn', date: 'Notification' }
]

const fessenheim: AppelOffre = {
  id: 'Fessenheim',
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
  dataFields: commonDataFields,
  periodes: [
    {
      id: '1',
      title: 'première'
    },
    {
      id: '2',
      title: 'deuxième'
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

const autre: AppelOffre = {
  id: 'autre',
  title:
    '2019/S 019-040037 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
  shortTitle: 'Autre',
  launchDate: 'Janvier 2019',
  powerUnit: 'MWc',
  monthsBeforeRealisation: 24,
  referencePriceParagraph: '7',
  derogatoryDelayParagraph: '6.4',
  conformityParagraph: '6.6',
  completePluginRequestParagraph: '6.1',
  designationRemovalParagraph: '5.3 et 6.2',
  ipFpEngagementParagraph: '3.2.6 et 7.1.2',
  dataFields: commonDataFields,
  periodes: [
    {
      id: '3',
      title: 'troisième'
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

const appelsOffreStatic = [fessenheim, autre]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  },
  findById: async (id: AppelOffre['id']) => {
    return appelsOffreStatic.find(ao => ao.id === id)
  }
}

export { appelOffreRepo, appelsOffreStatic }
