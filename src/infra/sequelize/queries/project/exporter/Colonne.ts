import { Literal } from 'sequelize/types/utils'

type PropriétéDeLaColonneDétail = {
  source: 'propriété-colonne-détail'
  nomPropriété: string
}
type ChampSimple = {
  source: 'champ-simple'
  nomColonneTableProjet: string
  intitulé: string
}
type ExpressionSql = {
  source: 'expression-sql'
  expressionSql: Literal
  aliasColonne: string
  intitulé: string
}

export type Colonne = PropriétéDeLaColonneDétail | ChampSimple | ExpressionSql

export const isPropriétéDeLaColonneDétail = (
  colonne: Colonne
): colonne is PropriétéDeLaColonneDétail => colonne.source === 'propriété-colonne-détail'

export const isNotPropriétéDeLaColonneDétail = (
  colonne: Colonne
): colonne is ChampSimple | ExpressionSql => colonne.source !== 'propriété-colonne-détail'
