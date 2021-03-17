import {
  String,
  Number,
  Record,
  Union,
  Literal,
  Static,
  Undefined,
  Partial,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'
import { projectSchema } from './project'
import { userSchema } from './user'

const baseModificationRequestSchema = Record({
  id: String,
  userId: String,
  projectId: String,
})

const actionnaireSchema = Record({
  type: Literal('actionnaire'),
  actionnaire: String,
  fileId: String,
})
const producteurSchema = Record({
  type: Literal('producteur'),
  producteur: String,
  fileId: String,
})
const fournisseurSchema = Record({
  type: Literal('fournisseur'),
  fournisseur: String,
  evaluationCarbone: Number,
  justification: String,
  fileId: String,
})
const puissanceSchema = Record({
  type: Literal('puissance'),
  puissance: Number.withConstraint((value) => value > 0),
})
const abandonSchema = Record({
  type: Literal('abandon'),
  justification: String,
})
const recoursSchema = Record({
  type: Literal('recours'),
  justification: String,
})
const delaiSchema = Record({
  type: Literal('delai'),
  justification: String,
  delayInMonths: Number,
})

const modificationRequestSchema = baseModificationRequestSchema
  .And(
    Union(
      actionnaireSchema,
      producteurSchema,
      fournisseurSchema,
      puissanceSchema,
      abandonSchema,
      recoursSchema,
      delaiSchema
    )
  )
  .And(
    Partial({
      fileId: String,
      requestedOn: Number,
      project: projectSchema.Or(Undefined),
      user: userSchema.Or(Undefined),
      status: Union(
        Literal('envoyée'),
        Literal('en instruction'),
        Literal('en validation'),
        Literal('validée'),
        Literal('refusée')
      ),
    })
  )

const fields: string[] = [
  'fileId',
  'attachmentFile',
  'requestedOn',
  'type',
  'actionnaire',
  'producteur',
  'fournisseur',
  'puissance',
  'justification',
  'evaluationCarbone',
  'user',
  'project',
  'delayInMonths',
  'status',
  ...Object.keys(baseModificationRequestSchema.fields),
]

type ModificationRequest = Static<typeof modificationRequestSchema> & {
  attachmentFile?: {
    id: string
    filename: string
  }
}

interface MakeModificationRequestDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeModificationRequestDependencies) =>
  buildMakeEntity<ModificationRequest>(modificationRequestSchema, makeId, fields, {
    requestedOn: () => Date.now(),
    status: () => 'envoyée',
  })

export { ModificationRequest }
