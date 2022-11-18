import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(ProjectGFDueDateSet, async (évènement, transaction) => {
  const {
    payload: { projectId, garantiesFinancieresDueOn },
    occurredAt,
  } = évènement

  const projectEvent = await ProjectEvent.findOne({
    where: { type: 'GarantiesFinancières', projectId },
    transaction,
  })

  try {
    await ProjectEvent.upsert(
      {
        id: projectEvent?.id || new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        projectId,
        payload: {
          ...projectEvent?.payload,
          dateLimiteDEnvoi: garantiesFinancieresDueOn,
        },
      },
      { transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFDueDateSet`,
        {
          évènement,
          nomProjection: 'ProjectEvent.ProjectGFDueDateSet',
        },
        e
      )
    )
  }
})
