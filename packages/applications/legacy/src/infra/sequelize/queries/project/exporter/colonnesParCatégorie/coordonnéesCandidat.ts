import { Colonne } from '../Colonne';

export const coordonnéesCandidat: Readonly<Array<Colonne>> = [
  { nomPropriété: `Région d'implantation`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Adresse`, source: 'propriété-colonne-détail' },
  {
    nomColonneTableProjet: 'nomRepresentantLegal',
    source: 'champ-simple',
    intitulé: 'Nom et prénom du représentant légal',
  },
  {
    nomPropriété: `Titre du représentant légal`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Nom et prénom du signataire du formulaire`,
    source: 'propriété-colonne-détail',
  },
  { nomPropriété: `Nom et prénom du contact`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Titre du contact`, source: 'propriété-colonne-détail' },
  {
    nomPropriété: `Adresse postale du contact`,
    source: 'propriété-colonne-détail',
  },
  {
    nomColonneTableProjet: 'email',
    source: 'champ-simple',
    intitulé: 'Adresse électronique du contact',
  },
  { nomPropriété: `Téléphone`, source: 'propriété-colonne-détail' },
];
