import {
  isCertificateDTO,
  ProjectCertificateDTO,
  ProjectEventDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

export const getLatestCertificateEvent = (
  events: ProjectEventDTO[]
): ProjectCertificateDTO | undefined => {
  return events
    .filter(isCertificateDTO)
    .sort((a, b) => a.date - b.date)
    .pop()
}
