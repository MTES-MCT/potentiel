import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

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
      if (!is('GarantiesFinancières')(projectEvent)) return
      const payload: GarantiesFinancièreEventPayload = {
        ...projectEvent.payload,
        dateLimiteDEnvoi: garantiesFinancieresDueOn,
      }
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload,
        },
        { transaction, where: { id: projectEvent.id } }
      )
      return
    }

    const payload: GarantiesFinancièreEventPayload = {
      statut: 'due',
      dateLimiteDEnvoi: garantiesFinancieresDueOn,
    }
    await ProjectEvent.create(
      {
        projectId,
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload,
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
