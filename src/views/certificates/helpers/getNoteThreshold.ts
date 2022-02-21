import { logger } from '@core/utils'
import { ProjectAppelOffre } from '@entities'

type GetNoteThreshold = (project: {
  appelOffre: ProjectAppelOffre
  puissance: number
  territoireProjet?: string
  familleId?: string
}) => number | 'N/A'

export const getNoteThreshold: GetNoteThreshold = ({
  appelOffre,
  puissance,
  territoireProjet,
  familleId,
}) => {
  const { periode } = appelOffre

  if (!periode.isNotifiedOnPotentiel) {
    logger.error(
      `candidateCertificate: looking for noteThreshold for a period that was not notified on Potentiel. Periode Id : ${periode.id}`
    )
    return 'N/A'
  }

  if (periode.noteThresholdBy === 'category') {
    const { volumeReserve, autres } = periode.noteThreshold
    if (puissance <= volumeReserve.puissanceMax) {
      return volumeReserve.noteThreshold
    }

    return autres.noteThreshold
  }

  if (periode.noteThresholdBy === 'family') {
    if (territoireProjet && territoireProjet.length) {
      const note = periode.noteThreshold.find(
        (item) => item.familleId === familleId && item.territoire === territoireProjet
      )?.noteThreshold

      if (!note) {
        logger.error(
          `candidateCertificate: looking for noteThreshold for periode: ${periode.id}, famille: ${familleId} and territoire: ${territoireProjet} but could not find it`
        )
        return 'N/A'
      }

      return note
    }

    const note = periode.noteThreshold.find((item) => item.familleId === familleId)?.noteThreshold

    if (!note) {
      logger.error(
        `candidateCertificate: looking for noteThreshold for periode: ${periode.id} and famille: ${familleId} but could not find it`
      )
      return 'N/A'
    }

    return note
  }

  return periode.noteThreshold
}
