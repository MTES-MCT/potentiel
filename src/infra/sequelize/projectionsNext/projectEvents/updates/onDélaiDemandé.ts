import { DélaiDemandé } from '@modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  DélaiDemandé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId, projetId, autorité, dateAchèvementDemandée, porteurId } = payload

    const demandeDélai = await ProjectEvent.findOne({
      where: { id: demandeDélaiId, type: 'DemandeDélai' },
      transaction,
    })

    if (demandeDélai) {
      await ProjectEvent.update(
        {
          payload: {
            statut: 'envoyée',
            autorité,
            dateAchèvementDemandée,
            demandeur: porteurId,
          },
        },
        { where: { id: demandeDélaiId }, transaction }
      )
    } else {
      await ProjectEvent.create(
        {
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: {
            statut: 'envoyée',
            autorité,
            dateAchèvementDemandée,
            demandeur: porteurId,
          },
        },
        { transaction }
      )
    }
  }
)
