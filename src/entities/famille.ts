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

const familleSchema = Record({
  id: String,
  title: String,
  requiresFinancialGuarantee: Boolean
})

const fields: string[] = [...Object.keys(familleSchema.fields)]

type Famille = Static<typeof familleSchema>

interface MakeFamilleDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeFamilleDependencies) =>
  buildMakeEntity<Famille>(familleSchema, makeId, fields)

export { Famille, familleSchema }
