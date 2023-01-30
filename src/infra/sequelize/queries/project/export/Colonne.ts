import { Literal } from 'sequelize/types/utils'

export type Colonne =
  | {
      details?: undefined
      champ: string | Literal
      intitulé: string
    }
  | {
      details: true
      champ: string
    }

const isNotColonneDétail = (c: Colonne): c is Colonne & { details: undefined } => c.details !== true
const isColonneDétail = (c: Colonne): c is Colonne & { details: true } => c.details === true

export const mapperVersAttributs = (colonnes: Array<Colonne>): Array<[string | Literal, string]> =>
  colonnes.filter(isNotColonneDétail).map((c) => [c.champ, c.intitulé])

export const récupérerColonnesDétails = (colonnes: Array<Colonne>) =>
  colonnes.filter(isColonneDétail).map((c) => c.champ)

export const récupérerIntitulés = (colonnes: Array<Colonne>) =>
  colonnes.map((c) => (c.details ? c.champ : c.intitulé))
