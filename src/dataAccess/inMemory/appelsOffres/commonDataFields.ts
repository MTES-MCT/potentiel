import toTypeLiteral from './helpers/toTypeLiteral'

const commonDataFields = [
  { field: 'numeroCRE', type: toTypeLiteral('string'), column: 'N°CRE' },
  {
    field: 'nomCandidat',
    type: toTypeLiteral('orStringInColumn'),
    column: 'Nom (personne physique) ou raison sociale (personne morale) :',
    value: 'Candidat',
  },
  { field: 'nomProjet', type: toTypeLiteral('string'), column: 'Nom projet' },
  {
    field: 'puissance',
    type: toTypeLiteral('number'),
    column: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  {
    field: 'prixReference',
    type: toTypeLiteral('number'),
    column: 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
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
  {
    field: 'codePostalProjet',
    type: toTypeLiteral('codePostal'),
    column: 'CP',
  },
  { field: 'communeProjet', type: toTypeLiteral('string'), column: 'Commune' },
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
  {
    field: 'isFinancementParticipatif',
    type: toTypeLiteral('stringEquals'),
    column: 'Investissement ou financement participatif ?',
    value: 'Financement participatif (T2)',
  },
  { field: 'notifiedOn', type: toTypeLiteral('date'), column: 'Notification' },
]

const additionalFields = [
  {
    field: 'appelOffreId',
    column: "Appel d'offres",
  },
  { field: 'periodeId', column: 'Période' },
  {
    field: 'evaluationCarbone',
    column:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  {
    field: 'familleId',
    column: 'Famille',
  },
  {
    field: 'departementProjet',
    column: 'Département',
  },
  { field: 'regionProjet', column: 'Région' },
  {
    field: 'garantiesFinancieresDate',
    column: 'Date déclarée par le PP de dépôt des garanties financières',
  },
  {
    field: 'garantiesFinancieresSubmittedOn',
    column: 'Date de soumission sur Potentiel des garanties financières',
  },
]

export { commonDataFields, additionalFields }

export const dataFieldsFlattened: Map<string, string> = [
  ...commonDataFields,
  ...additionalFields,
].reduce((fields, currField) => {
  fields.set(currField.field, currField.column)
  return fields
}, new Map())
