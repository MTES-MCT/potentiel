import { is, ProjectEventDTO } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type GFItemProps = {
  type: 'garanties-financieres'
  role: UserRole
  date: number
} & (
  | {
      status: 'due' | 'past-due'
    }
  | {
      status: 'pending-validation' | 'validated'
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
    type: 'garanties-financieres' as 'garanties-financieres',
    date,
    role,
  }

  return type === 'ProjectGFSubmitted'
    ? {
        ...props,
        url:
          eventToHandle.filename && makeDocumentUrl(eventToHandle.fileId, eventToHandle.filename),
        status: latestProjectGF.type === 'ProjectGFValidated' ? 'validated' : 'pending-validation',
      }
    : {
        ...props,
        status: date < now ? 'past-due' : 'due',
      }
}

const isProjectGF = or(
  is('ProjectGFDueDateSet'),
  is('ProjectGFSubmitted'),
  is('ProjectGFRemoved'),
  is('ProjectGFValidated'),
  is('ProjectGFInvalidated')
)
