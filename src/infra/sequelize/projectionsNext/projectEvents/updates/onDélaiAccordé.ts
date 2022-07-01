import { DélaiAccordé } from '@modules/demandeModification'
import { logger } from '@core/utils'
import { ProjectEvent } from '../projectEvent.model'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEvent.projector.on(DélaiAccordé, async (evenement, transaction) => {
  const {
    payload: {
      demandeDélaiId,
      accordéPar,
      dateAchèvementAccordée,
      ancienneDateThéoriqueAchèvement,
    },
    occurredAt,
  } = evenement

  const projectEvent = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction })

  if (!projectEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        evenement,
        nomProjection: 'ProjectEvent.onDélaiAccordé',
      })
    )
    return
  }

  try {
    await ProjectEvent.update(
      {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          //@ts-ignore
          ...projectEvent.payload,
          statut: 'accordée',
          accordéPar,
          dateAchèvementAccordée,
          ancienneDateThéoriqueAchèvement,
        },
      },
      { where: { id: demandeDélaiId }, transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement DélaiAccordé`,
        {
          evenement,
          nomProjection: 'ProjectEvent.onDélaiAccordé',
        },
        e
      )
    )
  }
})
