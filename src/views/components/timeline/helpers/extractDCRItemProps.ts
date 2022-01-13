import {
  ProjectEventDTO,
  isProjectDCRDueDateSet,
  isProjectDCRRemoved,
  isProjectDCRSubmitted,
} from '../../../../modules/frise'
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
    }
  | {
      status: 'submitted'
      url: string
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

  const projectDCRDueDateSetOrSubmitted =
    lastProjectDCREvent.type !== 'ProjectDCRRemoved'
      ? projectDCREvents.pop()
      : projectDCREvents.filter(isProjectDCRDueDateSet).pop()

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
      }
    : { ...props, status: date < now ? 'past-due' : 'due', url: undefined }
}

const isProjectDCR = or(or(isProjectDCRDueDateSet, isProjectDCRSubmitted), isProjectDCRRemoved)
