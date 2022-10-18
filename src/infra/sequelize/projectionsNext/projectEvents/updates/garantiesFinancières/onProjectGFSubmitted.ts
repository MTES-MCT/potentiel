import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import models from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

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
    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })

    if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFSubmitted`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFSubmitted',
        })
      )
      return
    }

    const payload: GarantiesFinancièreEventPayload = {
      statut: 'pending-validation',
      dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
      dateConstitution: gfDate.getTime(),
      fichier: file,
      ...(expirationDate && { dateExpiration: expirationDate?.getTime() }),
    }
    await ProjectEvent.update(
      {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload,
      },
      {
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFSubmitted`,
        {
          évènement,
          nomProjection: 'ProjectEvent.ProjectGFSubmitted',
        },
        e
      )
    )
  }
})
