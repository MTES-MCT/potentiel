import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  NouveauCahierDesChargesChoisi,
  async (évènement, transaction) => {
    const {
      payload: { projetId, choisiPar, paruLe, alternatif },
    } = évènement
    try {
      await ProjectEvent.create(
        {
          id: new UniqueEntityID().toString(),
          projectId: projetId,
          type: 'NouveauCahierDesChargesChoisi',
          payload: {
            choisiPar,
            paruLe,
            ...(alternatif && { alternatif }),
          },
          valueDate: évènement.occurredAt.getTime(),
          eventPublishedAt: évènement.occurredAt.getTime(),
        },
        { transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement DélaiDemandé (projectEvent.update)`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onDélaiDemandé',
          },
          error
        )
      )
    }
  }
)
