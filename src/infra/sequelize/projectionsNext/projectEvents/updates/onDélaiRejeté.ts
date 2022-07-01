import { DélaiRejeté } from '@modules/demandeModification'
import { logger } from '@core/utils'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DélaiRejeté,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, rejetéPar } = payload

    const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction })

    if (!instance) {
      logger.error(
        `Error : onDélaiRejeté n'a pas pu retrouver la demandeDélaiId ${demandeDélaiId} pour la mettre à jour.`
      )
      return
    }

    Object.assign(instance, {
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        statut: 'rejetée',
        rejetéPar,
        // @ts-ignore
        dateAchèvementDemandée: instance.payload.dateAchèvementDemandée,
        demandeDélaiId,
      },
    })

    try {
      await instance.save({ transaction })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onDélaiRejeté n'a pas pu enregistrer la mise à jour de la demande ref ${demandeDélaiId}.`
      )
    }
  }
)
