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

import { territoireSchema } from './project'

const basePeriodeSchema = RTRecord({
  id: String,
  title: String,
})

const noteThresholdSchema = RTRecord({
  familleId: String,
  noteThreshold: Number,
}).And(
  Partial({
    territoire: territoireSchema,
  })
)

const periodeSchema = basePeriodeSchema.And(
  Partial({
    noteThresholdByFamily: Array(noteThresholdSchema),
    canGenerateCertificate: Boolean,
  })
)

const fields: string[] = [
  'noteThresholdByFamily',
  'canGenerateCertificate',
  ...Object.keys(basePeriodeSchema.fields),
]

type Periode = Static<typeof periodeSchema>

interface MakePeriodeDependencies {
  makeId: () => string
}

export default ({ makeId }: MakePeriodeDependencies) =>
  buildMakeEntity<Periode>(periodeSchema, makeId, fields)

export { Periode, periodeSchema }
