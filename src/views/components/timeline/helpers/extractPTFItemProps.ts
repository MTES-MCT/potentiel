import { is, ProjectEventDTO } from '../../../../modules/frise'
import { or } from '../../../../core/utils'
import { UserRole } from '../../../../modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type PTFItemProps = {
  type: 'proposition-technique-et-financiere'
  role: UserRole
} & (
  | {
      status: 'not-submitted'
      date: undefined
      url: undefined
    }
  | {
      status: 'submitted'
      date: number
      url: string
    }
)

export const extractPTFItemProps = (events: ProjectEventDTO[]): PTFItemProps | null => {
  if (!events.length) {
    return null
  }

  const projectPTFEvents = events.filter(isProjectPTF)
  const latestProjectPTF = projectPTFEvents.pop()

  if (!latestProjectPTF || latestProjectPTF.type === 'ProjectPTFRemoved') {
    return {
      type: 'proposition-technique-et-financiere',
      role: latestProjectPTF ? latestProjectPTF.variant : events.slice(-1)[0].variant,
      status: 'not-submitted',
      date: undefined,
      url: undefined,
    }
  }

  const { variant: role, date, fileId, filename } = latestProjectPTF

  return {
    type: 'proposition-technique-et-financiere',
    role,
    date,
    url: makeDocumentUrl(fileId, filename),
    status: 'submitted',
  }
}

const isProjectPTF = or(is('ProjectPTFSubmitted'), is('ProjectPTFRemoved'))
