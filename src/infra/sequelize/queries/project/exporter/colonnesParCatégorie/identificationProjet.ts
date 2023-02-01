import { Colonne } from '../Colonne'
import { literal } from 'sequelize'

export const identificationProjet: Readonly<Array<Colonne>> = [
  { champ: 'numeroCRE', intitulé: 'N°CRE' },
  { champ: 'appelOffreId', intitulé: "Appel d'offres" },
  { champ: 'periodeId', intitulé: 'Période' },
  { champ: 'familleId', intitulé: 'Famille' },
  { champ: 'nomProjet', intitulé: 'Nom projet' },
  { champ: 'nomCandidat', intitulé: 'Candidat' },
  { champ: 'actionnaire', intitulé: 'Société mère' },
  { champ: 'territoireProjet', intitulé: '"Territoire\n(AO ZNI)"' },
  { champ: `Numéro SIREN ou SIRET*`, details: true },
  { champ: `Code NACE`, details: true },
  { champ: `Nature du candidat`, details: true },
  { champ: `Type entreprise`, details: true },
  { champ: 'technologie', intitulé: 'Technologie\n(dispositif de production)' },
  { champ: `Typologie de projet`, details: true },
  {
    champ: 'puissance',
    intitulé: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  { champ: `Puissance installée (MWc)`, details: true },
  {
    champ: 'engagementFournitureDePuissanceAlaPointe',
    intitulé: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  },
  {
    champ: `Diamètre du rotor (m)\n(AO éolien)`,
    details: true,
  },
  {
    champ: `Hauteur bout de pâle (m)\n(AO éolien)`,
    details: true,
  },
  {
    champ: `Nb d'aérogénérateurs\n(AO éolien)`,
    details: true,
  },
  {
    champ: literal(`TO_CHAR(TO_TIMESTAMP("notifiedOn" / 1000), 'DD/MM/YYYY')`),
    intitulé: 'Notification',
  },
  { champ: 'cahierDesChargesActuel', intitulé: 'cahier des charges choisi' },
  { champ: 'classe', intitulé: 'Classé ?' },
]
