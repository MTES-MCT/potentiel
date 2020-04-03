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
  Undefined
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

const periodeSchema = Record({
  id: String,
  title: String
})

const fields: string[] = [...Object.keys(periodeSchema.fields)]

type Periode = Static<typeof periodeSchema>

interface MakePeriodeDependencies {
  makeId: () => string
}

export default ({ makeId }: MakePeriodeDependencies) =>
  buildMakeEntity<Periode>(periodeSchema, makeId, fields)

export { Periode, periodeSchema }
