import { AppelOffre } from '../../entities'
import { asLiteral } from '../../helpers/asLiteral'
import _ from 'lodash'

const commonDataFields = [
  {
    field: 'appelOffreId',
    type: asLiteral('string'),
    column: "Appel d'offres",
  },
  { field: 'periodeId', type: asLiteral('string'), column: 'Période' },
  { field: 'numeroCRE', type: asLiteral('string'), column: 'N°CRE' },
  {
    field: 'familleId',
    type: asLiteral('string'),
    column: 'Famille de candidature',
  },
  { field: 'nomCandidat', type: asLiteral('string'), column: 'Candidat' },
  { field: 'nomProjet', type: asLiteral('string'), column: 'Nom projet' },
  {
    field: 'puissance',
    type: asLiteral('number'),
    column:
      'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  {
    field: 'prixReference',
    type: asLiteral('number'),
    column:
      'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  },
  {
    field: 'evaluationCarbone',
    type: asLiteral('number'),
    column:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  { field: 'note', type: asLiteral('number'), column: 'Note totale' },
  {
    field: 'nomRepresentantLegal',
    type: asLiteral('string'),
    column: 'Nom et prénom du représentant légal',
  },
  {
    field: 'email',
    type: asLiteral('string'),
    column: 'Adresse électronique du contact',
  },
  {
    field: 'adresseProjet',
    type: asLiteral('string'),
    column: 'N°, voie, lieu-dit',
  },
  { field: 'codePostalProjet', type: asLiteral('string'), column: 'CP' },
  { field: 'communeProjet', type: asLiteral('string'), column: 'Commune' },
  {
    field: 'departementProjet',
    type: asLiteral('string'),
    column: 'Département',
  },
  { field: 'regionProjet', type: asLiteral('string'), column: 'Région' },
  { field: 'classe', type: asLiteral('string'), column: 'Classé ?' },
  {
    field: 'motifsElimination',
    type: asLiteral('string'),
    column: "Motif d'élimination",
  },
  {
    field: 'fournisseur',
    type: asLiteral('string'),
    column: 'Nom du fabricant \n(Modules ou films)',
  },
  {
    field: 'actionnaire',
    type: asLiteral('string'),
    column: 'Nom (personne physique) ou raison sociale (personne morale) :',
  },
  {
    field: 'producteur',
    type: asLiteral('string'),
    column: 'Nom et prénom du signataire du formulaire',
  },
  { field: 'notifiedOn', type: asLiteral('date'), column: 'Notification' },
]

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
  completePluginRequestParagraph: '6.1',
  designationRemovalParagraph: '5.3 et 6.2',
  ipFpEngagementParagraph: '3.2.6 et 7.1.2',
  dataFields: commonDataFields,
  noteThreshold: 6,
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
  familles: [
    {
      id: '1',
      title: '<100kwc',
      requiresFinancialGuarantee: true,
    },
  ],
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
  noteThreshold: 6,
  dataFields: commonDataFields,
  periodes: [
    {
      id: '3',
      title: 'troisième',
    },
  ],
  familles: [
    {
      id: '1',
      title: '<100kwc',
      requiresFinancialGuarantee: true,
    },
  ],
}

const appelsOffreStatic = [fessenheim, autre]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  },
  findById: async (id: AppelOffre['id']) => {
    return appelsOffreStatic.find((ao) => ao.id === id)
  },
}

export { appelOffreRepo, appelsOffreStatic }
