import { ProjectEventDTO } from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

export const getLatestCertificateEvent = (
  events: ProjectEventDTO[]
): ProjectEventDTO | undefined => {
  const certificateEvents: ProjectEventDTO[] = []
  for (const event of events) {
    if (
      [
        'ProjectCertificateGenerated',
        'ProjectCertificateRegenerated',
        'ProjectCertificateUpdated',
      ].includes(event.type)
    ) {
      certificateEvents.push(event)
    }
  }
  if (certificateEvents) {
    certificateEvents.sort((a, b) => a.date - b.date)
    return certificateEvents[certificateEvents.length - 1]
  } else {
    return
  }
}
