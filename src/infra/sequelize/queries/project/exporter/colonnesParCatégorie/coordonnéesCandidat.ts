import { Colonne } from '../Colonne'

export const coordonnéesCandidat: Readonly<Array<Colonne>> = [
  { champ: `Région d'implantation`, details: true },
  { champ: `Adresse`, details: true },
  { champ: 'nomRepresentantLegal', intitulé: 'Nom et prénom du représentant légal' },
  {
    champ: `Titre du représentant légal`,
    details: true,
  },
  {
    champ: `Nom et prénom du signataire du formulaire`,
    details: true,
  },
  { champ: `Nom et prénom du contact`, details: true },
  { champ: `Titre du contact`, details: true },
  {
    champ: `Adresse postale du contact`,
    details: true,
  },
  { champ: 'email', intitulé: 'Adresse électronique du contact' },
  { champ: `Téléphone`, details: true },
]
