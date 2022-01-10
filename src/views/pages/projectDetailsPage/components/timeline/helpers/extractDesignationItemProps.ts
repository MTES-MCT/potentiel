import { Project } from '../../../../../../entities'
import ROUTES from '../../../../../../routes'
import { getLatestCertificateEvent } from '.'
import {
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise'

export type DesignationItemProps = {
  type: 'designation'
  date: number
  certificate?: AttestationDesignationItemProps
}

export type AttestationDesignationItemProps = {
  date: number
  url: string
  source: 'uploaded' | 'generated'
}

export const extractDesignationItemProps = (
  events: ProjectEventDTO[],
  projectId: Project['id']
): DesignationItemProps | null => {
  const projectNotifiedEvent = events.find(isProjectNotified)
  if (!projectNotifiedEvent) return null

  const certificateEvent = getLatestCertificateEvent(events)

  const certificate: AttestationDesignationItemProps | undefined = certificateEvent && {
    date: certificateEvent.date,
    source: ['ProjectClaimed', 'ProjectCertificateUpdated'].includes(certificateEvent.type)
      ? 'uploaded'
      : 'generated',
    url: makeCertificateLink(certificateEvent, projectId),
  }

  return { type: 'designation', date: projectNotifiedEvent.date, certificate }
}

const isProjectNotified = (event: ProjectEventDTO): event is ProjectNotifiedDTO =>
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
