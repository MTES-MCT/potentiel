import isEmail from 'isemail'
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
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

const passwordRetrievalSchema = Record({
  id: String,
  email: String,
  createdOn: Number,
})

const fields: string[] = [...Object.keys(passwordRetrievalSchema.fields)]

type PasswordRetrieval = Static<typeof passwordRetrievalSchema>

interface MakePasswordRetrievalDependencies {
  makeId: () => string
}

export default ({ makeId }: MakePasswordRetrievalDependencies) =>
  buildMakeEntity<PasswordRetrieval>(passwordRetrievalSchema, makeId, fields)

export { PasswordRetrieval }
