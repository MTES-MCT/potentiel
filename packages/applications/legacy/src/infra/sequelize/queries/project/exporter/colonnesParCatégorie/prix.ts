import { Colonne } from '../Colonne';

export const prix: Readonly<Array<Colonne>> = [
  {
    nomPropriété: `Prix Majoré`,
    source: 'propriété-colonne-détail',
  },
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'prixReference',
    intitulé: 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  },
  {
    nomPropriété: `Prix de référence (€/MWh)`,
    source: 'propriété-colonne-détail',
  },
];
