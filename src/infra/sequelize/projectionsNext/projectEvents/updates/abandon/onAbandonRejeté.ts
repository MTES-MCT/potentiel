import { UniqueEntityID } from '@core/domain'
import { Transaction } from 'sequelize'
import { AbandonRejeté } from '../../../../../../modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { models } from '../../../../models'

export default ProjectEventProjector.on(AbandonRejeté, async (evenement, transaction) => {
  const {
    payload: { demandeAbandonId, fichierRéponseId },
    occurredAt,
  } = evenement

  const { ModificationRequest } = models

  const { projectId } = await ModificationRequest.findByPk(demandeAbandonId, {
    attributes: ['projectId'],
    transaction,
  })

  if (projectId) {
    const file = await getFile(fichierRéponseId, transaction)
    await ProjectEvent.create(
      {
        projectId,
        type: 'ModificationRequestRejected',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { modificationRequestId: demandeAbandonId, ...(file && { file }) },
      },
      { transaction }
    )
  }
})

const getFile = async (
  responseFileId: string,
  transaction: Transaction | undefined
): Promise<{ id: string; name: string } | undefined> => {
  const { File } = models
  const rawFilename = await File.findByPk(responseFileId, {
    attributes: ['filename'],
    transaction,
  })

  if (!rawFilename?.filename) return undefined
  return { id: responseFileId, name: rawFilename?.filename }
}
