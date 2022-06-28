import { DélaiAnnulé } from '@modules/modificationRequest'
import { logger } from '@core/utils'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DélaiAnnulé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, annuléPar, projetId } = payload

    const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId } })

    if (!instance) {
      logger.error(
        `Error : onDélaiAnnulé n'a pas pu retrouver la demandeDélaiId ${demandeDélaiId} pour la mettre à jour.`
      )
      await ProjectEvent.create(
        {
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: {
            statut: 'annulée',
            annuléPar,
          },
        },
        { transaction }
      )
      return
    }

    Object.assign(instance, {
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { statut: 'annulée', annuléPar },
    })

    try {
      await instance.save({ transaction })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onDélaiAnnulé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeDélaiId}.`
      )
    }
  }
)
