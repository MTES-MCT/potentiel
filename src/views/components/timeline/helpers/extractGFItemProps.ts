import {
  isProjectGFDueDateSet,
  isProjectGFSubmitted,
  ProjectEventDTO,
} from '../../../../modules/frise'
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

  if (!latestProjectGF) {
    return null
  }

  const { date, variant: role, type } = latestProjectGF

  const props = {
    type: 'garantiesFinancieres' as 'garantiesFinancieres',
    date,
    role,
  }

  return type === 'ProjectGFSubmitted'
    ? {
        ...props,
        url: makeDocumentUrl(latestProjectGF.fileId, latestProjectGF.filename),
        status: 'submitted',
      }
    : { ...props, status: date < now ? 'past-due' : 'due', url: undefined }
}

const isProjectGF = or(isProjectGFDueDateSet, isProjectGFSubmitted)
