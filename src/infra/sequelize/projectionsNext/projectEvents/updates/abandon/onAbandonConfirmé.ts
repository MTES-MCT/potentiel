import { UniqueEntityID } from '@core/domain'
import { AbandonConfirmé } from '../../../../../../modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { models } from '../../../../models'

export default ProjectEventProjector.on(AbandonConfirmé, async (evenement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = evenement

  const { ModificationRequest } = models

  const { projectId } = await ModificationRequest.findByPk(demandeAbandonId, {
    attributes: ['projectId'],
    transaction,
  })

  if (projectId) {
    await ProjectEvent.create(
      {
        projectId,
        type: 'ModificationRequestConfirmed',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { modificationRequestId: demandeAbandonId },
      },
      { transaction }
    )
  }
})
