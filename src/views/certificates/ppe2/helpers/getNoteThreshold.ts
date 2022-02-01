import { ProjectDataForCertificate } from '@modules/project'
import { logger } from '@core/utils'

export const getNoteThreshold = (project: ProjectDataForCertificate): number | 'N/A' => {
  const periode = project.appelOffre.periode

  if (periode.noteThresholdByCategory) {
    const { volumesReserves, autres } = periode.noteThresholdByCategory
    if (project.puissance <= volumesReserves.puissanceMax) {
      return volumesReserves.noteThreshold
    }

    return autres.noteThreshold
  }

  if (!periode.noteThresholdByFamily) {
    logger.error(
      `candidateCertificate: looking for noteThresholdByFamily for a period that has none. Periode Id : ${periode.id}`
    )
    return 'N/A'
  }

  if (project.territoireProjet && project.territoireProjet.length) {
    const note = periode.noteThresholdByFamily.find(
      (item) => item.familleId === project.familleId && item.territoire === project.territoireProjet
    )?.noteThreshold

    if (!note) {
      logger.error(
        `candidateCertificate: looking for noteThreshold for periode: ${periode.id}, famille: ${project.familleId} and territoire: ${project.territoireProjet} but could not find it`
      )
      return 'N/A'
    }

    return note
  }

  const note = periode.noteThresholdByFamily.find(
    (item) => item.familleId === project.familleId
  )?.noteThreshold

  if (!note) {
    logger.error(
      `candidateCertificate: looking for noteThreshold for periode: ${periode.id} and famille: ${project.familleId} but could not find it`
    )
    return 'N/A'
  }

  return note
}
