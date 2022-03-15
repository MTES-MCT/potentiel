import { is, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { or } from '@core/utils'
import { UserRole } from '@modules/users'
import { makeDocumentUrl } from './makeDocumentUrl'

export type PTFItemProps = {
  type: 'proposition-technique-et-financiere'
  role: UserRole
} & (
  | {
      status: 'not-submitted'
      date: undefined
    }
  | {
      status: 'submitted'
      date: number
      url?: string
    }
)

export const extractPTFItemProps = (
  events: ProjectEventDTO[],
  project: {
    status: ProjectStatus
  }
): PTFItemProps | null => {
  if (!events.length || project.status === 'Eliminé') {
    return null
  }

  const projectPTFEvents = events.filter(isProjectPTF)
  const latestProjectPTF = projectPTFEvents.pop()

  if (!latestProjectPTF || is('ProjectPTFRemoved')(latestProjectPTF)) {
    return project.status !== 'Abandonné'
      ? {
          type: 'proposition-technique-et-financiere',
          role: latestProjectPTF ? latestProjectPTF.variant : events.slice(-1)[0].variant,
          status: 'not-submitted',
          date: undefined,
        }
      : null
  }

  const { variant: role, date, file } = latestProjectPTF

  return {
    type: 'proposition-technique-et-financiere',
    role,
    date,
    url: file && makeDocumentUrl(file.id, file.name),
    status: 'submitted',
  }
}

const isProjectPTF = or(is('ProjectPTFSubmitted'), is('ProjectPTFRemoved'))
