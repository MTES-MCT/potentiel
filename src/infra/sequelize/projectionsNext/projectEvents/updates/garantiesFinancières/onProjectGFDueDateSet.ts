import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { typeCheck } from '../../guards/typeCheck'
import {
  GarantiesFinancièreEventPayload,
  GarantiesFinancièresEvent,
} from '../../events/GarantiesFinancièresEvent'

export default ProjectEventProjector.on(ProjectGFDueDateSet, async (évènement, transaction) => {
  const {
    payload: { projectId, garantiesFinancieresDueOn },
    occurredAt,
  } = évènement

  try {
    const projectEvent = (await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })) as GarantiesFinancièresEvent | undefined

    if (projectEvent) {
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
