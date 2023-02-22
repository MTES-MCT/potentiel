import { Colonne } from '../Colonne';

export const coûtInvestissement: Readonly<Array<Colonne>> = [
  { nomPropriété: `Raccordement € / kWc`, source: 'propriété-colonne-détail' },
  { nomPropriété: `Investissement total (k€)`, source: 'propriété-colonne-détail' },
  {
    nomPropriété: `dont quantité de fonds propres (k€)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `dont quantité d'endettement  (k€)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `dont quantité de subventions à l'investissement  (k€)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `dont quantité d'autres avantages financiers  (k€)`,
    source: 'propriété-colonne-détail',
  },
  { nomPropriété: `Location (€/an/MWc)`, source: 'propriété-colonne-détail' },
  { nomPropriété: `CAPEX Moyen\n(k€ / MWc)`, source: 'propriété-colonne-détail' },
];
