import { Colonne } from '../Colonne'

export const potentielSolaire: Readonly<Array<Colonne>> = [
  {
    nomPropriété: `Ensoleillement de référence (kWh/m²/an)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Productible annuel (MWh/an)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Facteur de charges (kWh/kWc)`,
    source: 'propriété-colonne-détail',
  },
]
