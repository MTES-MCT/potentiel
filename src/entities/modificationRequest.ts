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
  Undefined,
  Partial
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

const baseModificationRequestSchema = Record({
  id: String,
  requestedBy: String,
  projectId: String
})

const actionnaireSchema = Record({
  type: Literal('actionnaire'),
  actionnaire: String
})
const producteurSchema = Record({
  type: Literal('producteur'),
  producteur: String
})
const fournisseurSchema = Record({
  type: Literal('fournisseur'),
  fournisseur: String
})
const puissanceSchema = Record({
  type: Literal('puissance'),
  puissance: Number.withConstraint(value => value > 0)
})
const abandonSchema = Record({
  type: Literal('abandon'),
  justification: String
})
const delaiSchema = Record({
  type: Literal('delai'),
  justification: String
})

const modificationRequestSchema = baseModificationRequestSchema
  .And(
    Union(
      actionnaireSchema,
      producteurSchema,
      fournisseurSchema,
      puissanceSchema,
      abandonSchema,
      delaiSchema
    )
  )
  .And(
    Partial({
      filePath: String,
      requestedOn: Number
    })
  )

const fields: string[] = [
  'filePath',
  'type',
  'actionnaire',
  'producteur',
  'fournisseur',
  'puissance',
  'justification',
  'requestedOn',
  ...Object.keys(baseModificationRequestSchema.fields)
]

type ModificationRequest = Static<typeof modificationRequestSchema>

interface MakeModificationRequestDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeModificationRequestDependencies) =>
  buildMakeEntity<ModificationRequest>(
    modificationRequestSchema,
    makeId,
    fields,
    { requestedOn: () => Date.now() }
  )

export { ModificationRequest }
