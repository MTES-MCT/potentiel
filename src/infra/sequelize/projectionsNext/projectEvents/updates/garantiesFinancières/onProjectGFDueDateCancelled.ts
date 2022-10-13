import { ProjectGFDueDateCancelled } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId },
    } = évènement

    try {
      await ProjectEvent.destroy({
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      })
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ProjectGFDueDateCancelled`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onProjectGFDueDateCancellede',
          },
          e
        )
      )
    }
  }
)
