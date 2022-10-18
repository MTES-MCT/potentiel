import { ProjectGFUploaded } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import models from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'
import { UniqueEntityID } from '@core/domain'
import { is } from '../../guards'

export default ProjectEventProjector.on(ProjectGFUploaded, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, gfDate, expirationDate, submittedBy },
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

  const { User } = models
  const rawUser = await User.findOne({
    attributes: ['role'],
    where: { id: submittedBy },
    transaction,
  })

  if (!rawUser) {
    logger.error(
      new Error(
        `Impossible de trouver l'utilisateur (id = ${submittedBy}) émetteur d'une GF pour le project ${projectId})`
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
      await ProjectEvent.create(
        {
          id: new UniqueEntityID().toString(),
          type: 'GarantiesFinancières',
          projectId,
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: typeCheck<GarantiesFinancièreEventPayload>({
            statut: 'uploaded',
            dateConstitution: gfDate.getTime(),
            fichier: file,
            ...(expirationDate && { dateExpiration: expirationDate.getTime() }),
            initiéParRole: rawUser?.role,
          }),
        },
        { transaction }
      )
      return
    }

    await ProjectEvent.update(
      {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: typeCheck<GarantiesFinancièreEventPayload>({
          statut: 'uploaded',
          dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
          dateConstitution: gfDate.getTime(),
          fichier: file,
          ...(expirationDate && { dateExpiration: expirationDate.getTime() }),
          initiéParRole: rawUser?.role,
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
