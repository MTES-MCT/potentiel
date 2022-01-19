import { is, ProjectEventDTO } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type GFItemProps = {
  type: 'garantiesFinancieres'
  role: UserRole
  date: number
  validationStatus: 'validée' | 'à traiter' | 'non-applicable'
} & (
  | {
      status: 'due' | 'past-due'
      url: undefined
    }
  | {
      status: 'submitted'
      url: string | undefined
    }
)

export const extractGFItemProps = (events: ProjectEventDTO[], now: number): GFItemProps | null => {
  const latestProjectGF = events.filter(isProjectGF).pop()
  const latestDueDateSetEvent = events.filter(is('ProjectGFDueDateSet')).pop()
  const latestSubmittedEvent = events.filter(is('ProjectGFSubmitted')).pop()

  if (!latestProjectGF) {
    return null
  }

  const eventToHandle =
    latestProjectGF.type === 'ProjectGFRemoved' && latestDueDateSetEvent
      ? latestDueDateSetEvent
      : latestProjectGF.type === 'ProjectGFValidated' && latestSubmittedEvent
      ? latestSubmittedEvent
      : latestProjectGF.type === 'ProjectGFInvalidated' && latestSubmittedEvent
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
        url:
          eventToHandle.filename && makeDocumentUrl(eventToHandle.fileId, eventToHandle.filename),
        status: 'submitted',
        validationStatus: latestProjectGF.type === 'ProjectGFValidated' ? 'validée' : 'à traiter',
      }
    : {
        ...props,
        status: date < now ? 'past-due' : 'due',
        url: undefined,
        validationStatus: 'non-applicable',
      }
}

const isProjectGF = or(
  is('ProjectGFDueDateSet'),
  is('ProjectGFSubmitted'),
  is('ProjectGFRemoved'),
  is('ProjectGFValidated'),
  is('ProjectGFInvalidated')
)
