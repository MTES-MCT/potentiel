import { Literal, Static, Union } from 'runtypes'

export const territoireSchema = Union(
  Literal('Corse'),
  Literal('Guadeloupe'),
  Literal('Guyane'),
  Literal('La Réunion'),
  Literal('Mayotte'),
  Literal('Martinique')
)

export type Territoire = Static<typeof territoireSchema>
