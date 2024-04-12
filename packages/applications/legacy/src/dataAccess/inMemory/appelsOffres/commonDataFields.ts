import toTypeLiteral from './helpers/toTypeLiteral';
import { Project } from '../../../entities';

const dateFieldFormatter = (value) => value && new Date(value).toLocaleDateString();

const commonDataFields = [
  { field: 'numeroCRE', type: toTypeLiteral('string'), column: 'N°CRE' },
  {
    field: 'nomCandidat',
    type: toTypeLiteral('orStringInColumn'),
    column: 'Nom (personne physique) ou raison sociale (personne morale) :',
  },
  { field: 'nomProjet', type: toTypeLiteral('string'), column: 'Nom projet' },
  {
    field: 'puissance',
    type: toTypeLiteral('number'),
    column: 'puissance',
  },
  {
    field: 'prixReference',
    type: toTypeLiteral('number'),
    column: 'prixReference',
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
    column: 'Investissement participatif',
    value: (row) => (row.isInvestissementParticipatif === true ? 'Oui' : ''),
  },
  {
    field: 'isFinancementParticipatif',
    column: 'Financement participatif',
    value: (row) => (row.isFinancementParticipatif === true ? 'Oui' : ''),
  },
  {
    field: 'notifiedOn',
    value: (row) => dateFieldFormatter(row.notifiedOn),
    type: toTypeLiteral('date'),
    column: 'Notification',
  },
  {
    field: 'financementCollectif',
    value: (row) => (row.actionnariat === 'financement-collectif' ? 'Oui' : ''),
    column: 'Financement collectif',
  },
  {
    field: 'gouvernancePartagée',
    value: (row) => (row.actionnariat === 'gouvernance-partagee' ? 'Oui' : ''),
    column: 'Gouvernance partagée',
  },
];

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
    field: 'garantiesFinancières.dateConstitution',
    value: (row) => dateFieldFormatter(row.garantiesFinancières?.dateConstitution),
    column: 'Date déclarée par le PP de dépôt des garanties financières',
  },
  {
    field: 'garantiesFinancières.dateEnvoi',
    value: (row) => dateFieldFormatter(row.garantiesFinancières?.dateEnvoi),
    column: 'Date de soumission sur Potentiel des garanties financières',
  },
  {
    field: 'technologie',
    value: (row) => row.technologie,
    column: 'Technologie\n(dispositif de production)',
  },
];

const dataFieldsFlattened: Map<
  string,
  { label: string; value: string | ((project: Project) => any) }
> = [...commonDataFields, ...additionalFields].reduce((fields, currField) => {
  fields.set(currField.field, {
    label: currField.column,
    value: currField.value ?? currField.field,
  });
  return fields;
}, new Map());

export { commonDataFields, additionalFields, dataFieldsFlattened };
