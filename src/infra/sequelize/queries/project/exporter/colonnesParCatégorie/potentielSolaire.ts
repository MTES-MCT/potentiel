import { Colonne } from '../Colonne'

export const potentielSolaire: Readonly<Array<Colonne>> = [
  {
    champ: `Ensoleillement de référence (kWh/m²/an)`,
    details: true,
  },
  {
    champ: `Productible annuel (MWh/an)`,
    details: true,
  },
  {
    champ: `Facteur de charges (kWh/kWc)`,
    details: true,
  },
]
