import { Colonne } from '../Colonne'

export const coûtInvestissement: Readonly<Array<Colonne>> = [
  { champ: `Raccordement € / kWc`, details: true },
  { champ: `Investissement total (k€)`, details: true },
  {
    champ: `dont quantité de fonds propres (k€)`,
    details: true,
  },
  {
    champ: `dont quantité d'endettement  (k€)`,
    details: true,
  },
  {
    champ: `dont quantité de subventions à l'investissement  (k€)`,
    details: true,
  },
  {
    champ: `dont quantité d'autres avantages financiers  (k€)`,
    details: true,
  },
  { champ: `Location (€/an/MWc)`, details: true },
  { champ: `CAPEX Moyen\n(k€ / MWc)`, details: true },
]
