import { logger } from '@core/utils'
import { RejetRecoursAnnulé } from '@modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(RejetRecoursAnnulé, async ({ payload }, transaction) => {
  const { demandeRecoursId } = payload

  try {
    await ProjectEvent.destroy({
      where: {
        type: 'ModificationRequestRejected',
        'payload.modificationRequestId': demandeRecoursId,
      },
      transaction,
    })
    await ProjectEvent.destroy({
      where: {
        type: 'ModificationRequestInstructionStarted',
        'payload.modificationRequestId': demandeRecoursId,
      },
      transaction,
    })
  } catch (e) {
    logger.error(e)
    logger.info(
      `Error: onRejetRecoursAnnulé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeRecoursId}.`
    )
  }
  return
})
