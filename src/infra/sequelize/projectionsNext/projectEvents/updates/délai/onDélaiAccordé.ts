import { DélaiAccordé } from '@modules/demandeModification'
import { logger } from '@core/utils'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEventProjector.on(DélaiAccordé, async (évènement, transaction) => {
  const {
    payload: {
      demandeDélaiId,
      accordéPar,
      dateAchèvementAccordée,
      ancienneDateThéoriqueAchèvement,
    },
    occurredAt,
  } = évènement

  const projectEvent = await ProjectEvent.findOne({ where: { id: demandeDélaiId }, transaction })

  if (!projectEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        évènement,
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
          évènement,
          nomProjection: 'ProjectEvent.onDélaiAccordé',
        },
        e
      )
    )
  }
})
