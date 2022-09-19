import { UniqueEntityID } from '@core/domain'
import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  NouveauCahierDesChargesChoisi,
  async (événement, transaction) => {
    const {
      payload: { projetId, choisiPar, paruLe },
    } = événement
    await ProjectEvent.create(
      {
        id: new UniqueEntityID().toString(),
        projectId: projetId,
        type: 'NouveauCahierDesChargesChoisi',
        payload: { choisiPar, paruLe },
        valueDate: événement.occurredAt.getTime(),
        eventPublishedAt: événement.occurredAt.getTime(),
      },
      { transaction }
    )
  }
)
