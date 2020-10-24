import isEmail from 'isemail'
import { String, Number, Record, Static, Partial } from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

const baseProjectAdmissionKeySchema = Record({
  id: String,
  email: String.withConstraint(isEmail.validate),
  fullName: String,
})

const projectAdmissionKeySchema = baseProjectAdmissionKeySchema.And(
  Partial({
    projectId: String,
    appelOffreId: String,
    periodeId: String,
    dreal: String,
    createdAt: Number,
    lastUsedAt: Number,
  })
)

const fields: string[] = [
  'projectId',
  'appelOffreId',
  'periodeId',
  'dreal',
  'createdAt',
  'lastUsedAt',
  ...Object.keys(baseProjectAdmissionKeySchema.fields),
]

type ProjectAdmissionKey = Static<typeof projectAdmissionKeySchema>

interface MakeProjectAdmissionKeyDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectAdmissionKeyDependencies) =>
  buildMakeEntity<ProjectAdmissionKey>(projectAdmissionKeySchema, makeId, fields, {
    lastUsedAt: 0,
    createdAt: () => Date.now(),
  })

export { ProjectAdmissionKey }
