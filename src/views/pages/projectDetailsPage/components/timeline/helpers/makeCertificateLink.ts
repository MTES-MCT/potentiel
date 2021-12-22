import { Project } from '../../../../../../entities/project'
import { ProjectCertificateDTO } from '../../../../../../modules/frise/dtos/ProjectEventListDTO'
import ROUTES from '../../../../../../routes'

export const makeCertificateLink = (
  latestCertificateEvent: ProjectCertificateDTO,
  projectId: Project['id']
) => {
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent
  if (variant === 'porteur-projet' || variant === 'acheteur-obligé') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
      id: projectId,
      certificateFileId,
      nomProjet,
      potentielIdentifier,
    })
  } else if (variant === 'admin' || variant === 'dgec') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
      id: projectId,
      certificateFileId,
      email: latestCertificateEvent.email,
      potentielIdentifier,
    })
  }
}
