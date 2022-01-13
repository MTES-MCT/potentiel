import {
  ProjectEventDTO,
  ProjectDCRDueDateSetDTO,
  ProjectDCRSubmittedDTO,
} from '../../../../modules/frise'
import { or } from '../../../../core/utils'

import ROUTES from '../../../../routes'
import { UserRole } from '../../../../modules/users'

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
  const latestProjectDCR = events.filter(isProjectDCR).pop()

  if (!latestProjectDCR) {
    return null
  }

  const { date, variant: role, type } = latestProjectDCR

  const props = {
    type: 'demande-complete-de-raccordement' as 'demande-complete-de-raccordement',
    date,
    role,
  }

  return type === 'ProjectDCRSubmitted'
    ? {
        ...props,
        url: makeDocumentUrl(latestProjectDCR.fileId, latestProjectDCR.filename),
        status: 'submitted',
      }
    : { ...props, status: date < now ? 'past-due' : 'due', url: undefined }
}

const isProjectDCRDueDateSet = (event: ProjectEventDTO): event is ProjectDCRDueDateSetDTO =>
  event.type === 'ProjectDCRDueDateSet'

const isProjectDCRSubmitted = (event: ProjectEventDTO): event is ProjectDCRSubmittedDTO =>
  event.type === 'ProjectDCRSubmitted'

const isProjectDCR = or(isProjectDCRDueDateSet, isProjectDCRSubmitted)

const makeDocumentUrl = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}
