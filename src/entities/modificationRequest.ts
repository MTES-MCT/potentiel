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
import { projectSchema } from './project'
import { userSchema } from './user'

const baseModificationRequestSchema = Record({
  id: String,
  userId: String,
  projectId: String
})

const actionnaireSchema = Record({
  type: Literal('actionnaire'),
  actionnaire: String,
  filePath: String
})
const producteurSchema = Record({
  type: Literal('producteur'),
  producteur: String,
  filePath: String
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
      // filePath: String,
      requestedOn: Number,
      project: projectSchema.Or(Undefined),
      user: userSchema.Or(Undefined)
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
  'user',
  'project',
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
