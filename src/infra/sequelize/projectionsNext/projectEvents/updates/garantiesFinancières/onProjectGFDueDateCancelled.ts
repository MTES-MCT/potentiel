import { ProjectGFDueDateCancelled } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { Op } from 'sequelize'
import { GarantiesFinancièresEvent } from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'

export default ProjectEventProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId },
    } = évènement

    try {
      const projectEvent = (await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      })) as GarantiesFinancièresEvent | undefined

      if (!projectEvent) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ProjectGFDueDateCancelled`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onProjectGFDueDateCancelled',
            }
          )
        )
        return
      }

      if (!projectEvent.payload.dateLimiteDEnvoi) {
        return
      }

      if (projectEvent.payload.fichier) {
        const newPayload = projectEvent.payload
        delete newPayload.dateLimiteDEnvoi
        await ProjectEvent.update(
          {
            payload: typeCheck<GarantiesFinancièresEvent['payload']>({
              ...newPayload,
            }),
          },
          {
            where: { type: 'GarantiesFinancières', projectId },
            transaction,
          }
        )
        return
      }

      await ProjectEvent.destroy({
        where: {
          type: 'GarantiesFinancières',
          projectId,
          'payload.dateLimiteDEnvoi': { [Op.not]: null },
        },
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
