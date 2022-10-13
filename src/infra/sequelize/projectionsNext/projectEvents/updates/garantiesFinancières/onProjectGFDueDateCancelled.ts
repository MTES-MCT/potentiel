import { ProjectGFDueDateCancelled } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { Op } from 'sequelize'
import { typeCheck } from '../../guards/typeCheck'
import {
  GarantiesFinancièreEventPayload,
  GarantiesFinancièresEvent,
} from '../../events/GarantiesFinancièresEvent'

export default ProjectEventProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId },
      occurredAt,
    } = évènement

    try {
      const projectEvent = (await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      })) as GarantiesFinancièresEvent | undefined

      if (!projectEvent) {
        logger.error(
          new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFRemoved`, {
            évènement,
            nomProjection: 'ProjectEvent.onProjectGFRemoved',
          })
        )
        return
      }

      const { dateLimiteDEnvoi, ...newPayload } = { ...projectEvent?.payload }

      if (newPayload.statut !== 'due' && !dateLimiteDEnvoi) {
        await ProjectEvent.update(
          {
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: typeCheck<GarantiesFinancièreEventPayload>(newPayload),
          },
          {
            where: {
              type: 'GarantiesFinancières',
              projectId,
              'payload.dateLimiteDEnvoi': { [Op.not]: null },
            },
            transaction,
          }
        )
      } else {
        await ProjectEvent.destroy({
          where: {
            type: 'GarantiesFinancières',
            projectId,
            'payload.dateLimiteDEnvoi': { [Op.not]: null },
          },
          transaction,
        })
      }
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
