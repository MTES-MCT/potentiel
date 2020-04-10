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

const projectAdmissionKeySchema = Record({
  id: String,
  email: String.withConstraint(isEmail.validate),
  fullName: String,
})

const fields: string[] = [...Object.keys(projectAdmissionKeySchema.fields)]

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
