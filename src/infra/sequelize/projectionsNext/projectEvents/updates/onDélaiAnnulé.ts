import { logger } from '@core/utils'
import { DélaiAnnulé } from '@modules/demandeModification'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DélaiAnnulé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, annuléPar } = payload

    const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction })

    if (!instance) {
      logger.error(
        `Error : onDélaiAnnulé n'a pas pu retrouver la demandeDélaiId ${demandeDélaiId} pour la mettre à jour.`
      )
      return
    }

    Object.assign(instance, {
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        // @ts-ignore
        ...instance.payload,
        statut: 'annulée',
        annuléPar,
      },
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
