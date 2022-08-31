import { logger } from '@core/utils'
import { DélaiRejeté } from '@modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(DélaiRejeté, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId, rejetéPar },
    occurredAt,
  } = évènement

  const instance = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction })

  if (!instance) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        evenement: évènement,
        nomProjection: 'ProjectEvent.onDélaiEnInstruction',
      })
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
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiRejeté`,
        {
          evenement: évènement,
          nomProjection: 'ProjectEvent.onDélaiRejeté',
        },
        e
      )
    )
  }
})
