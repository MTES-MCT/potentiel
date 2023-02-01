import { Literal } from 'sequelize/types/utils'

export type Colonne =
  | {
      details?: undefined
      literal?: undefined
      champ: string
      intitulé: string
    }
  | {
      details?: undefined
      literal: Literal
      alias: string
      intitulé: string
    }
  | {
      details: true
      champ: string
    }

const isNotColonneDétail = (c: Colonne): c is Colonne & { details: undefined } => c.details !== true
const isColonneDétail = (c: Colonne): c is Colonne & { details: true } => c.details === true

export const mapperVersAttributs = (
  colonnes: Readonly<Array<Colonne>>
): Array<[Literal, string] | string> =>
  colonnes.filter(isNotColonneDétail).map((c) => (c.literal ? [c.literal, c.alias] : c.champ))

export const récupérerColonnesNonDétails = (colonnes: Readonly<Array<Colonne>>) =>
  colonnes.filter(isNotColonneDétail)

export const récupérerColonnesDétails = (colonnes: Readonly<Array<Colonne>>) =>
  colonnes.filter(isColonneDétail).map((c) => c.champ)

export const récupérerIntitulés = (colonnes: Readonly<Array<Colonne>>) =>
  colonnes.map((c) => (c.details ? c.champ : c.intitulé))
