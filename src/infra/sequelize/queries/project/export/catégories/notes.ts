import { Colonne } from '../Colonne'

export const notes: Readonly<Array<Colonne>> = [
  { champ: `Note prix`, details: true },
  { champ: `Note carbone`, details: true },
  { champ: `Note environnementale`, details: true },
  {
    champ: `Note innovation\n(AO innovation)`,
    details: true,
  },
  { champ: 'note', intitulé: 'Note totale' },
]
