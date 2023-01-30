import { Colonne } from '../Colonne'

export const donnéesDeRaccordement: Readonly<Array<Colonne>> = [
  {
    champ: `Référence du dossier de raccordement*`,
    details: true,
  },
  {
    champ: `Date de mise en service du raccordement attendue (mm/aaaa)`,
    details: true,
  },
  {
    champ: `Capacité du raccordement (kW)`,
    details: true,
  },
  {
    champ: `Montant estimé du raccordement (k€)`,
    details: true,
  },
  {
    champ: 'dateFileAttente',
    intitulé: "Date d'entrée en file d'attente",
  },
  {
    champ: 'dateMiseEnService',
    intitulé: 'Date de mise en service',
  },
  {
    champ: 'numeroGestionnaire',
    intitulé: 'Numéro de gestionnaire réseau',
  },
]
