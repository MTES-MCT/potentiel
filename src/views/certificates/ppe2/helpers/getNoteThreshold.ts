import { ProjectDataForCertificate } from '@modules/project'
import { logger } from '@core/utils'

export const getNoteThreshold = (project: ProjectDataForCertificate) => {
  const periode = project.appelOffre.periode

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
