import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { typeCheck } from '../../guards/typeCheck'
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
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: typeCheck<GarantiesFinancièreEventPayload>({
            ...projectEvent.payload,
            dateLimiteDEnvoi: garantiesFinancieresDueOn,
          }),
        },
        { transaction, where: { id: projectEvent.id } }
      )
      return
    }

    await ProjectEvent.create(
      {
        projectId,
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: typeCheck<GarantiesFinancièreEventPayload>({
          statut: 'due',
          dateLimiteDEnvoi: garantiesFinancieresDueOn,
        }),
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
