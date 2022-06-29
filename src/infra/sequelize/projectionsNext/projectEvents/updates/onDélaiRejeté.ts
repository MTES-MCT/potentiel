import { DélaiRefusé } from '@modules/demandeModification'
import { logger } from '@core/utils'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DélaiRefusé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, refuséPar } = payload

    const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId } })

    if (!instance) {
      logger.error(
        `Error : onDélaiRefusé n'a pas pu retrouver la demandeDélaiId ${demandeDélaiId} pour la mettre à jour.`
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
        refuséPar,
      },
    })

    try {
      await instance.save({ transaction })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onDélaiRefusé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeDélaiId}.`
      )
    }
  }
)
