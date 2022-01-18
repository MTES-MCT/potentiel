import { ProjectEventDTO, is } from '../../../../modules/frise'
import { or } from '../../../../core/utils'
import { UserRole } from '../../../../modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type DCRItemProps = {
  type: 'demande-complete-de-raccordement'
  role: UserRole
  date: number
} & (
  | {
      status: 'due' | 'past-due'
      url: undefined
      numeroDossier: undefined
    }
  | {
      status: 'submitted'
      url: string
      numeroDossier: string
    }
)

export const extractDCRItemProps = (
  events: ProjectEventDTO[],
  now: number
): DCRItemProps | null => {
  const projectDCREvents = events.filter(isProjectDCR)

  if (!projectDCREvents.length) {
    return null
  }

  const lastProjectDCREvent = projectDCREvents.slice(-1)[0]

  const projectDCRDueDateSetOrSubmitted = is('ProjectDCRRemoved')(lastProjectDCREvent)
    ? projectDCREvents.filter(is('ProjectDCRDueDateSet')).pop()
    : projectDCREvents.pop()

  if (!projectDCRDueDateSetOrSubmitted) {
    return null
  }

  const { date, variant: role, type } = projectDCRDueDateSetOrSubmitted

  const props = {
    type: 'demande-complete-de-raccordement' as 'demande-complete-de-raccordement',
    date,
    role,
  }

  return type === 'ProjectDCRSubmitted'
    ? {
        ...props,
        url: makeDocumentUrl(
          projectDCRDueDateSetOrSubmitted.fileId,
          projectDCRDueDateSetOrSubmitted.filename
        ),
        status: 'submitted',
        numeroDossier: projectDCRDueDateSetOrSubmitted.numeroDossier,
      }
    : {
        ...props,
        status: date < now ? 'past-due' : 'due',
        url: undefined,
        numeroDossier: undefined,
      }
}

const isProjectDCR = or(
  is('ProjectDCRDueDateSet'),
  is('ProjectDCRSubmitted'),
  is('ProjectDCRRemoved')
)
