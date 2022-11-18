import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import models from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { UniqueEntityID } from '@core/domain'

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

    await ProjectEvent.upsert(
      {
        id: projectEvent?.id || new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        projectId,
        payload: {
          ...projectEvent?.payload,
          statut: 'pending-validation',
          dateConstitution: gfDate.getTime(),
          fichier: file,
          ...(expirationDate && { dateExpiration: expirationDate?.getTime() }),
        },
      },
      {
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
