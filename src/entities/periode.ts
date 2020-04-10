import {
  String,
  Number,
  Record as RTRecord,
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

const basePeriodeSchema = RTRecord({
  id: String,
  title: String,
})

const noteThresholdSchema = RTRecord({
  familleId: String,
  noteThreshold: Number,
})

const periodeSchema = basePeriodeSchema.And(
  Partial({
    noteThresholdByFamily: Array(noteThresholdSchema),
  })
)

const fields: string[] = [
  'noteThresholdByFamily',
  ...Object.keys(basePeriodeSchema.fields),
]

type Periode = Static<typeof periodeSchema>

interface MakePeriodeDependencies {
  makeId: () => string
}

export default ({ makeId }: MakePeriodeDependencies) =>
  buildMakeEntity<Periode>(periodeSchema, makeId, fields)

export { Periode, periodeSchema }
