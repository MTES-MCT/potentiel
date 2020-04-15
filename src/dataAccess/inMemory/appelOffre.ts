import { AppelOffre } from '../../entities'
import { asLiteral } from '../../helpers/asLiteral'
import _ from 'lodash'
import { ValuesType } from 'utility-types'

const toTypeLiteral = (str) =>
  asLiteral<ValuesType<AppelOffre['dataFields']>['type']>(str)

const commonDataFields = [
  { field: 'numeroCRE', type: toTypeLiteral('string'), column: 'N°CRE' },
  {
    field: 'familleId',
    type: toTypeLiteral('string'),
    column: 'Famille de candidature',
  },
  {
    field: 'nomCandidat',
    type: toTypeLiteral('string'),
    column: 'Nom (personne physique) ou raison sociale (personne morale) :',
  },
  { field: 'nomProjet', type: toTypeLiteral('string'), column: 'Nom projet' },
  {
    field: 'puissance',
    type: toTypeLiteral('number'),
    column:
      'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  {
    field: 'prixReference',
    type: toTypeLiteral('number'),
    column:
      'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  },
  {
    field: 'evaluationCarbone',
    type: toTypeLiteral('number'),
    column:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  { field: 'note', type: toTypeLiteral('number'), column: 'Note totale' },
  {
    field: 'nomRepresentantLegal',
    type: toTypeLiteral('string'),
    column: 'Nom et prénom du représentant légal',
  },
  {
    field: 'email',
    type: toTypeLiteral('string'),
    column: 'Adresse électronique du contact',
  },
  {
    field: 'adresseProjet',
    type: toTypeLiteral('string'),
    column: 'N°, voie, lieu-dit',
  },
  { field: 'codePostalProjet', type: toTypeLiteral('string'), column: 'CP' },
  { field: 'communeProjet', type: toTypeLiteral('string'), column: 'Commune' },
  {
    field: 'departementProjet',
    type: toTypeLiteral('string'),
    column: 'Département',
  },
  { field: 'regionProjet', type: toTypeLiteral('string'), column: 'Région' },
  { field: 'classe', type: toTypeLiteral('string'), column: 'Classé ?' },
  {
    field: 'motifsElimination',
    type: toTypeLiteral('string'),
    column: "Motif d'élimination",
  },
  {
    field: 'fournisseur',
    type: toTypeLiteral('string'),
    column: 'Nom du fabricant \n(Modules ou films)',
  },
  {
    field: 'isInvestissementParticipatif',
    type: toTypeLiteral('stringEquals'),
    column: 'Investissement ou financement participatif ?',
    value: 'Investissement participatif (T1)',
  },
  { field: 'notifiedOn', type: toTypeLiteral('date'), column: 'Notification' },
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
  ipFpEngagementParagraph: '3.2.6',
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

const appelsOffreStatic = [fessenheim]

const appelOffreRepo = {
  findAll: async () => {
    return appelsOffreStatic
  },
  findById: async (id: AppelOffre['id']) => {
    return appelsOffreStatic.find((ao) => ao.id === id)
  },
}

export { appelOffreRepo, appelsOffreStatic }
