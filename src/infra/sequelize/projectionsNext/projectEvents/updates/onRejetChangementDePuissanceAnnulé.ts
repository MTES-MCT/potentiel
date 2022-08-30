import { logger } from '@core/utils'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  RejetChangementDePuissanceAnnulé,
  async ({ payload }, transaction) => {
    const { demandeChangementDePuissanceId } = payload

    try {
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestRejected',
          'payload.modificationRequestId': demandeChangementDePuissanceId,
        },
        transaction,
      })
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestInstructionStarted',
          'payload.modificationRequestId': demandeChangementDePuissanceId,
        },
        transaction,
      })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onRejetRecoursAnnulé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeChangementDePuissanceId}.`
      )
    }
    return
  }
)
