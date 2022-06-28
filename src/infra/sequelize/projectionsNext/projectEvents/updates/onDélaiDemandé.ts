import { DélaiDemandé } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DélaiDemandé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, projetId, autorité, dateAchèvementDemandée, porteurId } = payload

    await ProjectEvent.create(
      {
        id: demandeDélaiId,
        projectId: projetId,
        type: 'DemandeDélai',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          statut: 'demande-envoyée',
          autorité,
          dateAchèvementDemandée,
          demandeur: porteurId,
        },
      },
      { transaction }
    )
  }
)
