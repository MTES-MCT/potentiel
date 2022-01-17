import { is, ProjectEventDTO } from '../../../../modules/frise'
import { or } from '../../../../core/utils'
import { UserRole } from '../../../../modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type GarantieFinanciereItemProps = {
  type: 'garantiesFinancieres'
  role: UserRole
  date: number
} & (
  | {
      status: 'due' | 'past-due'
      url: undefined
      validated: undefined
    }
  | {
      status: 'submitted'
      url: string
      validated: boolean
    }
)

export const extractGFItemProps = (
  events: ProjectEventDTO[],
  now: number
): GarantieFinanciereItemProps | null => {
  const latestProjectGF = events.filter(isProjectGF).pop()
  const latestDueDateSetEvent = events.filter(is('ProjectGFDueDateSet')).pop()
  const latestSubmittedEvent = events.filter(is('ProjectGFSubmitted')).pop()

  if (!latestProjectGF) {
    return null
  }

  const eventToHandle =
    latestDueDateSetEvent && latestProjectGF.type === 'ProjectGFRemoved'
      ? latestDueDateSetEvent
      : latestSubmittedEvent && latestProjectGF.type === 'ProjectStepStatusUpdated'
      ? latestSubmittedEvent
      : latestProjectGF

  const { date, variant: role, type } = eventToHandle

  const props = {
    type: 'garantiesFinancieres' as 'garantiesFinancieres',
    date,
    role,
  }

  return type === 'ProjectGFSubmitted'
    ? {
        ...props,
        url: makeDocumentUrl(eventToHandle.fileId, eventToHandle.filename),
        status: 'submitted',
        validated: latestProjectGF.type === 'ProjectStepStatusUpdated',
      }
    : { ...props, status: date < now ? 'past-due' : 'due', url: undefined, validated: undefined }
}

const isProjectGF = or(
  is('ProjectGFDueDateSet'),
  is('ProjectGFSubmitted'),
  is('ProjectGFRemoved'),
  is('ProjectStepStatusUpdated')
)
