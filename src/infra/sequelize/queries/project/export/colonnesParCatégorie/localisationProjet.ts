import { Colonne } from '../Colonne'

export const localisationProjet: Readonly<Array<Colonne>> = [
  { champ: 'adresseProjet', intitulé: 'N°, voie, lieu-dit' },
  { champ: 'codePostalProjet', intitulé: 'CP' },
  { champ: 'communeProjet', intitulé: 'Commune' },
  { champ: `Département`, details: true },
  { champ: `Région`, details: true },
]
