import { Project } from '../../../../entities'
import ROUTES from '../../../../routes'
import {
  isCertificateDTO,
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../modules/frise'

export type DesignationItemProps = {
  type: 'designation'
  date: number
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
  const projectNotifiedEvent = events.find(isProjectNotified)
  if (!projectNotifiedEvent) return null

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

  return { type: 'designation', date: projectNotifiedEvent.date, certificate }
}

export const isProjectNotified = (event: ProjectEventDTO): event is ProjectNotifiedDTO =>
  event.type === 'ProjectNotified'

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
