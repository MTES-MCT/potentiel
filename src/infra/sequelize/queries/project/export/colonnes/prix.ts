import { Colonne } from '../Colonne'

export const prix: Readonly<Array<Colonne>> = [
  {
    champ: `Prix Majoré`,
    details: true,
  },
  {
    champ: 'prixReference',
    intitulé: 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  },
  {
    champ: `Prix de référence (€/MWh)`,
    details: true,
  },
]
