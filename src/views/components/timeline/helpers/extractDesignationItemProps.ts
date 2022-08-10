import { Project } from '@entities'
import ROUTES from '@routes'
import {
  isCertificateDTO,
  is,
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectStatus,
} from '@modules/frise'
import { UserRole } from '@modules/users'
import { format } from 'date-fns'

export type DesignationItemProps = {
  type: 'designation'
  date: number
  role: UserRole
  projectStatus: ProjectStatus
  certificate:
    | {
        date: number
        url: string
        status: 'uploaded' | 'generated'
      }
    | {
        status: 'not-applicable'
      }
    | undefined
}

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  projectId: Project['id'],
  status: ProjectStatus
): DesignationItemProps | null => {
  const projectNotifiedEvent = events.find(is('ProjectNotified'))
  if (!projectNotifiedEvent) return null
  const { variant: role, date } = projectNotifiedEvent

  const certificateEvent = events
    .filter(isCertificateDTO)
    .filter((e) => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    .pop()

  if (certificateEvent) {
    return {
      type: 'designation',
      date,
      certificate: makeCertificateProps(certificateEvent, projectId),
      role: certificateEvent.variant,
      projectStatus: status,
    }
  }

  return {
    type: 'designation',
    date,
    certificate: projectNotifiedEvent.isLegacy ? { status: 'not-applicable' } : undefined,
    role,
    projectStatus: status,
  }
}

const makeCertificateLink = (
  latestCertificateEvent: ProjectCertificateDTO,
  projectId: Project['id']
) => {
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent
  if (variant === 'admin' || variant === 'dgec') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
      id: projectId,
      certificateFileId,
      email: latestCertificateEvent.email,
      potentielIdentifier,
    })
  }

  return ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
    id: projectId,
    certificateFileId,
    nomProjet,
    potentielIdentifier,
  })
}

const makeCertificateProps = (
  certificateEvent: ProjectCertificateDTO,
  projectId: Project['id']
): DesignationItemProps['certificate'] => {
  return {
    date: certificateEvent.date,
    status: ['ProjectClaimed', 'ProjectCertificateUpdated'].includes(certificateEvent.type)
      ? 'uploaded'
      : 'generated',
    url: makeCertificateLink(certificateEvent, projectId),
  }
}
