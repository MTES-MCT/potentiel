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
    }
  | {
      status: 'submitted'
      url: string
    }
)

export const extractGFItemProps = (
  events: ProjectEventDTO[],
  now: number
): GarantieFinanciereItemProps | null => {
  const latestProjectGF = events.filter(isProjectGF).pop()
  const latestDueDateSetEvent = events.filter(isProjectGFDueDateSet).pop()

  if (!latestProjectGF) {
    return null
  }

  const eventToHandle =
    latestDueDateSetEvent && latestProjectGF.type === 'ProjectGFRemoved'
      ? latestDueDateSetEvent
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
      }
    : { ...props, status: date < now ? 'past-due' : 'due', url: undefined }
}

const isProjectGF = or(is('ProjectGFDueDateSet'), is('ProjectGFSubmitted'), is('ProjectGFRemoved'))

const isProjectGFDueDateSet = (event: ProjectEventDTO): event is ProjectGFDueDateSetDTO =>
  event.type === 'ProjectGFDueDateSet'

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const isProjectGFRemoved = (event: ProjectEventDTO): event is ProjectGFRemovedDTO =>
  event.type === 'ProjectGFRemoved'
