import isEmail from 'isemail'
import { String, Number, Record, Static, Partial, Boolean } from '../types/schemaTypes'
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
    forRole: String,
    createdAt: Number,
    lastUsedAt: Number,
    cancelled: Boolean,
  })
)

const fields: string[] = [
  'projectId',
  'appelOffreId',
  'periodeId',
  'dreal',
  'forRole',
  'createdAt',
  'lastUsedAt',
  'cancelled',
  ...Object.keys(baseProjectAdmissionKeySchema.fields),
]

type ProjectAdmissionKey = Static<typeof projectAdmissionKeySchema>

interface MakeProjectAdmissionKeyDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectAdmissionKeyDependencies) =>
  buildMakeEntity<ProjectAdmissionKey>(projectAdmissionKeySchema, makeId, fields, {
    lastUsedAt: 0,
    cancelled: false,
    createdAt: () => Date.now(),
  })

export { ProjectAdmissionKey }
