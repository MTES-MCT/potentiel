import { Colonne } from '../Colonne'
import { literal } from 'sequelize'

export const identificationProjet: Readonly<Array<Colonne>> = [
  { source: 'champ-simple', nomColonneTableProjet: 'numeroCRE', intitulé: 'N°CRE' },
  { source: 'champ-simple', nomColonneTableProjet: 'appelOffreId', intitulé: "Appel d'offres" },
  { source: 'champ-simple', nomColonneTableProjet: 'periodeId', intitulé: 'Période' },
  { source: 'champ-simple', nomColonneTableProjet: 'familleId', intitulé: 'Famille' },
  { source: 'champ-simple', nomColonneTableProjet: 'nomProjet', intitulé: 'Nom projet' },
  { source: 'champ-simple', nomColonneTableProjet: 'nomCandidat', intitulé: 'Candidat' },
  { source: 'champ-simple', nomColonneTableProjet: 'actionnaire', intitulé: 'Société mère' },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'territoireProjet',
    intitulé: '"Territoire\n(AO ZNI)"',
  },
  { nomPropriété: `Numéro SIREN ou SIRET*`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Code NACE`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Nature du candidat`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Type entreprise`, source: 'propriété-colonne-détail' },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'technologie',
    intitulé: 'Technologie\n(dispositif de production)',
  },
  { nomPropriété: `Typologie de projet`, source: 'propriété-colonne-détail' },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'puissance',
    intitulé: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  { nomPropriété: `Puissance installée (MWc)`, source: 'propriété-colonne-détail' },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'engagementFournitureDePuissanceAlaPointe',
    intitulé: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  },
  {
    nomPropriété: `Diamètre du rotor (m)\n(AO éolien)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Hauteur bout de pâle (m)\n(AO éolien)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Nb d'aérogénérateurs\n(AO éolien)`,
    source: 'propriété-colonne-détail',
  },
  {
    source: 'expression-sql',
    expressionSql: literal(
      `CASE WHEN "notifiedOn" > 0 THEN TO_CHAR(TO_TIMESTAMP("notifiedOn" / 1000), 'DD/MM/YYYY') ELSE '' END`
    ),
    aliasColonne: 'notifiedOn',
    intitulé: 'Notification',
  },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'cahierDesChargesActuel',
    intitulé: 'cahier des charges choisi',
  },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'classe',
    intitulé: 'Classé ?',
  },
]
