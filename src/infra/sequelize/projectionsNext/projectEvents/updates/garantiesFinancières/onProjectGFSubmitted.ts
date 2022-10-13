import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import models from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièresEvent } from '../../events/GarantiesFinancièresEvent'

export default ProjectEventProjector.on(ProjectGFSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, gfDate, expirationDate },
    occurredAt,
  } = évènement

  const { File } = models
  const rawFilename = await File.findOne({
    attributes: ['filename'],
    where: { id: fileId },
    transaction,
  })

  if (!rawFilename) {
    logger.error(
      new Error(
        `Impossible de trouver le fichier (id = ${fileId}) d'attestation GF pour le project ${projectId})`
      )
    )
  }

  const filename: string | undefined = rawFilename?.filename
  const file = filename && { id: fileId, name: filename }

  try {
    const projectEvent = (await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })) as GarantiesFinancièresEvent | undefined

    if (!projectEvent) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFUploaded`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFUploaded',
        })
      )
      return
    }

    await ProjectEvent.update(
      {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
          statut: 'pending-validation',
          dateConstitution: gfDate.getTime(),
          ...(file && { fichier: file }),
          ...(expirationDate && { dateExpiration: expirationDate?.getTime() }),
        },
      },
      {
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      }
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
