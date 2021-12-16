import {
  ProjectCertificateDTO,
  ProjectEventDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

export const getLatestCertificateEvent = (
  events: ProjectEventDTO[]
): ProjectCertificateDTO | undefined => {
  const certificateEvents: ProjectCertificateDTO[] = []
  for (const event of events) {
    if (
      [
        'ProjectCertificateGenerated',
        'ProjectCertificateRegenerated',
        'ProjectCertificateUpdated',
      ].includes(event.type)
    ) {
      certificateEvents.push(event as ProjectCertificateDTO)
    }
  }
  if (certificateEvents) {
    certificateEvents.sort((a, b) => a.date - b.date)
    return certificateEvents[certificateEvents.length - 1]
  } else {
    return
  }
}
