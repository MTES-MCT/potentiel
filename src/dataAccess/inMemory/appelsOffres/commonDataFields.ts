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

const makeParagrapheAchevementForDelai = (
  delaiRealisationEnMois: number,
  renvoiDureeContrat: string
) => `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- ${delaiRealisationEnMois} mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au ${renvoiDureeContrat} est réduite de la durée de dépassement.`

export { commonDataFields, additionalFields, makeParagrapheAchevementForDelai }

export const dataFieldsFlattened: Map<string, string> = [
  ...commonDataFields,
  ...additionalFields,
].reduce((fields, currField) => {
  fields.set(currField.field, currField.column)
  return fields
}, new Map())
