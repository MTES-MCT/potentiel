import { ProjectGFDueDateCancelled } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { Op } from 'sequelize'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

export default ProjectEventProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId },
    } = évènement

    try {
      const projectEvent = await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      })

      if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
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
        const payload: GarantiesFinancièreEventPayload = projectEvent.payload
        delete payload.dateLimiteDEnvoi
        await ProjectEvent.update(
          { payload },
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
