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
  Partial,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

const baseProjectAdmissionKeySchema = Record({
  id: String,
  email: String.withConstraint(isEmail.validate),
  fullName: String,
})

const projectAdmissionKeySchema = baseProjectAdmissionKeySchema.And(
  Partial({
    projectId: String,
  })
)

const fields: string[] = [
  'projectId',
  ...Object.keys(baseProjectAdmissionKeySchema.fields),
]

type ProjectAdmissionKey = Static<typeof projectAdmissionKeySchema>

interface MakeProjectAdmissionKeyDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectAdmissionKeyDependencies) =>
  buildMakeEntity<ProjectAdmissionKey>(
    projectAdmissionKeySchema,
    makeId,
    fields
  )

export { ProjectAdmissionKey }
