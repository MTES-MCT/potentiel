import { logger } from '@core/utils'
import { RejetAbandonAnnulé } from '@modules/demandeModification'
import models from '../../../../models'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(RejetAbandonAnnulé, async ({ payload }, transaction) => {
  const { demandeAbandonId } = payload

  const demandeAbandonInstance = await ProjectEvent.findOne({
    where: { id: demandeAbandonId, type: 'DemandeAbandon' },
    transaction,
  })

  if (demandeAbandonInstance) {
    const { ModificationRequest } = models

    const rawRequestedOn = await ModificationRequest.findOne({
      attributes: ['requestedOn'],
      where: { id: demandeAbandonId },
      transaction,
    })

    if (!rawRequestedOn) {
      logger.error(
        new Error(
          `Erreur: impossible de trouver la modificationRequest (id = ${demandeAbandonId}) depuis onRejetDemandeAbandonAnnulé)`
        )
      )
    }

    Object.assign(demandeAbandonInstance, {
      valueDate: rawRequestedOn.requestedOn,
      eventPublishedAt: rawRequestedOn.requestedOn,
      payload: {
        ...demandeAbandonInstance.payload,
        statut: 'envoyée',
        rejetéPar: null,
      },
    })

    try {
      await demandeAbandonInstance.save({ transaction })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onRejetDemandeAbandonAnnulé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeAbandonId}.`
      )
    }
  }
})
