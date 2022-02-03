import { is, ProjectEventDTO } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type GFItemProps = {
  type: 'garanties-financieres'
  role: UserRole
} & (
  | {
      status: 'due' | 'past-due'
      date: number
    }
  | {
      status: 'pending-validation' | 'validated'
      url: string | undefined
      date: number
    }
  | {
      status: 'submitted-with-application'
      date: undefined
    }
)

export const extractGFItemProps = (
  events: ProjectEventDTO[],
  now: number,
  project: {
    isLaureat: boolean
  }
): GFItemProps | null => {
  if (!events.length || !project.isLaureat) {
    return null
  }

  const latestProjectGF = events.filter(isProjectGF).pop()
  const latestDueDateSetEvent = events.filter(is('ProjectGFDueDateSet')).pop()
  const latestSubmittedEvent = events.filter(is('ProjectGFSubmitted')).pop()

  if (!latestProjectGF) {
    return {
      type: 'garanties-financieres',
      role: events.slice(-1)[0].variant,
      status: 'submitted-with-application',
      date: undefined,
    }
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
        url: eventToHandle.file && makeDocumentUrl(eventToHandle.file.id, eventToHandle.file.name),
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
