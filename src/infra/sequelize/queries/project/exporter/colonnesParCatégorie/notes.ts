import { Colonne } from '../Colonne';

export const notes: Readonly<Array<Colonne>> = [
  { nomPropriété: `Note prix`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Note carbone`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Note environnementale`, source: 'propriété-colonne-détail' },
  {
    nomPropriété: `Note innovation\n(AO innovation)`,
    source: 'propriété-colonne-détail',
  },
  { source: 'champ-simple', nomColonneTableProjet: 'note', intitulé: 'Note totale' },
];
