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

  try {
    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })

    if (projectEvent) {
      await ProjectEvent.update(
        {
          projectId,
          type: 'GarantiesFinancières',
          valueDate: garantiesFinancieresDueOn,
          eventPublishedAt: occurredAt.getTime(),
          id: projectEvent.id,
          payload: {
            ...projectEvent?.payload,
            dateLimiteDEnvoi: garantiesFinancieresDueOn,
          },
        },
        { transaction, where: { id: projectEvent.id } }
      )
      return
    }

    await ProjectEvent.create(
      {
        projectId,
        type: 'GarantiesFinancières',
        valueDate: garantiesFinancieresDueOn,
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { statut: 'due', dateLimiteDEnvoi: garantiesFinancieresDueOn },
      },
      { transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFUploaded`,
        {
          évènement,
          nomProjection: 'ProjectEvent.ProjectGFUploaded',
        },
        e
      )
    )
  }
})
