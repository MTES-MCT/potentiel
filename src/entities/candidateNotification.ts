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

const baseCandidateNotificationSchema = Record({
  id: String,
  projectId: String,
  template: Union(Literal('laureat'), Literal('elimination')),
  projectAdmissionKey: String
})
const candidateNotificationSchema = baseCandidateNotificationSchema.And(
  Partial({ hash: String.withConstraint(value => value.length >= 1) })
)

const fields: string[] = [
  'hash',
  ...Object.keys(baseCandidateNotificationSchema.fields)
]

type CandidateNotification = Static<typeof candidateNotificationSchema>

interface MakeCandidateNotificationDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeCandidateNotificationDependencies) =>
  buildMakeEntity<CandidateNotification>(
    candidateNotificationSchema,
    makeId,
    fields
  )

export { CandidateNotification, candidateNotificationSchema }
