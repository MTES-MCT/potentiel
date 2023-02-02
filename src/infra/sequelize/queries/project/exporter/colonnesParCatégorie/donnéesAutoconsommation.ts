import { Colonne } from '../Colonne'

export const donnéesAutoconsommation: Readonly<Array<Colonne>> = [
  {
    nomPropriété: `Taux d'autoconsommation \n(AO autoconsommation)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Type de consommateur associé\n(AO autoconsommation)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)`,
    source: 'propriété-colonne-détail',
  },
  {
    nomPropriété: `Taux occupation toiture\n(AO autoconsommation)`,
    source: 'propriété-colonne-détail',
  },
]
