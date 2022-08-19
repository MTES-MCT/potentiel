import { logger } from '@core/utils'
import { DélaiRejeté } from '@modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
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
        // @ts-ignore
        ...instance.payload,
        statut: 'rejetée',
        rejetéPar,
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
