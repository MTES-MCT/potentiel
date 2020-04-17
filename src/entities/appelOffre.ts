import {
  String,
  Number,
  Record,
  Array,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Partial,
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

import { periodeSchema } from './periode'
import { familleSchema } from './famille'

const csvFieldSchema = Record({
  field: String,
  column: String,
  type: Union(
    Literal('string'),
    Literal('number'),
    Literal('date'),
    Literal('stringEquals')
  ),
}).And(
  Partial({
    value: String,
  })
)

const appelOffreSchema = Record({
  id: String,
  title: String,
  shortTitle: String,
  launchDate: String,
  powerUnit: String,
  monthsBeforeRealisation: Number,
  referencePriceParagraph: String,
  derogatoryDelayParagraph: String,
  conformityParagraph: String,
  completePluginRequestFootnote: String,
  designationRemovalFootnote: String,
  ipFpEngagementParagraph: String,
  ipFpEngagementFootnote: String,
  competitiveClauseParagraph: String,
  periodes: Array(periodeSchema),
  familles: Array(familleSchema),
  dataFields: Array(csvFieldSchema),
})

const fields: string[] = [...Object.keys(appelOffreSchema.fields)]

type AppelOffre = Static<typeof appelOffreSchema>

interface MakeAppelOffreDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeAppelOffreDependencies) =>
  buildMakeEntity<AppelOffre>(appelOffreSchema, makeId, fields)

export { AppelOffre, appelOffreSchema }
