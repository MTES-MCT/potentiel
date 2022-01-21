import { Project } from '@entities'
import ROUTES from '../../../../routes'
import { isCertificateDTO, is, ProjectCertificateDTO, ProjectEventDTO } from '@modules/frise'
import { UserRole } from '@modules/users'

export type DesignationItemProps = {
  type: 'designation'
  date: number
  role: UserRole
  certificate:
    | {
        date: number
        url: string
        status: 'uploaded' | 'generated'
      }
    | { status: 'pending' }
    | { status: 'not-applicable' }
}

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  projectId: Project['id']
): DesignationItemProps | null => {
  const projectNotifiedEvent = events.find(is('ProjectNotified'))
  if (!projectNotifiedEvent) return null

  const latestProjectNotificationDateSet = events.filter(is('ProjectNotificationDateSet')).pop()
  const date = latestProjectNotificationDateSet
    ? latestProjectNotificationDateSet.date
    : projectNotifiedEvent.date

  const certificateEvent = events.filter(isCertificateDTO).pop()

  const certificate: DesignationItemProps['certificate'] = certificateEvent
    ? {
        date: certificateEvent.date,
        status: ['ProjectClaimed', 'ProjectCertificateUpdated'].includes(certificateEvent.type)
          ? 'uploaded'
          : 'generated',
        url: makeCertificateLink(certificateEvent, projectId),
      }
    : { status: projectNotifiedEvent.isLegacy ? 'not-applicable' : 'pending' }

  const role: DesignationItemProps['role'] = certificateEvent
    ? certificateEvent.variant
    : projectNotifiedEvent.variant

  return { type: 'designation', date, certificate, role }
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
