import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import models from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import {
  GarantiesFinancièreEventPayload,
  GarantiesFinancièresEvent,
} from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'

export default ProjectEventProjector.on(ProjectGFSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, gfDate, expirationDate },
    occurredAt,
  } = évènement

  const { File } = models
  const rawFile = await File.findOne({
    attributes: ['filename'],
    where: { id: fileId },
    transaction,
  })

  if (!rawFile) {
    logger.error(
      new Error(
        `Impossible de trouver le fichier (id = ${fileId}) d'attestation GF pour le project ${projectId})`
      )
    )
  }

  const file = { id: fileId, name: rawFile.filename as string }

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
        payload: typeCheck<GarantiesFinancièreEventPayload>({
          statut: 'pending-validation',
          dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
          dateConstitution: gfDate.getTime(),
          fichier: file,
          ...(expirationDate && { dateExpiration: expirationDate?.getTime() }),
        }),
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
