import { Colonne } from '../Colonne'

export const donnéesDeRaccordement: Readonly<Array<Colonne>> = [
  {
    nomPropriété: `Référence du dossier de raccordement*`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Date de mise en service du raccordement attendue (mm/aaaa)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Capacité du raccordement (kW)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Montant estimé du raccordement (k€)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomColonneTableProjet: 'dateFileAttente',
    source: 'champ-simple',
    intitulé: "Date d'entrée en file d'attente",
  },
  {
    nomColonneTableProjet: 'dateMiseEnService',
    source: 'champ-simple',
    intitulé: 'Date de mise en service',
  },
  {
    nomColonneTableProjet: 'numeroGestionnaire',
    source: 'champ-simple',
    intitulé: 'Numéro de gestionnaire réseau',
  },
]
