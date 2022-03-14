import { ProjectEventDTO, is, ProjectEventListDTO } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type DCRItemProps = {
  type: 'demande-complete-de-raccordement'
  role: UserRole
  date: number
} & (
  | {
      status: 'due' | 'past-due'
    }
  | {
      status: 'submitted'
      url: string | undefined
      numeroDossier: string
    }
)

export const extractDCRItemProps = (
  events: ProjectEventDTO[],
  now: number,
  project: {
    status: ProjectEventListDTO['project']['status']
  }
): DCRItemProps | null => {
  const projectDCREvents = events.filter(isProjectDCR)

  if (!projectDCREvents.length || project.status === 'Eliminé') {
    return null
  }

  const lastProjectDCREvent = projectDCREvents.slice(-1)[0]

  const projectDCREvent = is('ProjectDCRRemoved')(lastProjectDCREvent)
    ? projectDCREvents.filter(is('ProjectDCRDueDateSet')).pop()
    : projectDCREvents.pop()

  if (!projectDCREvent) {
    return null
  }

  const { date, variant: role, type } = projectDCREvent

  const props = {
    type: 'demande-complete-de-raccordement' as 'demande-complete-de-raccordement',
    date,
    role,
  }

  return type === 'ProjectDCRSubmitted'
    ? {
        ...props,
        url:
          projectDCREvent.file &&
          makeDocumentUrl(projectDCREvent.file.id, projectDCREvent.file.name),
        status: 'submitted',
        numeroDossier: projectDCREvent.numeroDossier,
      }
    : project.status !== 'Abandonné'
    ? {
        ...props,
        status: date < now ? 'past-due' : 'due',
      }
    : null
}

const isProjectDCR = or(
  is('ProjectDCRDueDateSet'),
  is('ProjectDCRSubmitted'),
  is('ProjectDCRRemoved')
)
