import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { models } from '../../../../models'
import { AbandonAnnulé } from '../../../../../../modules/demandeModification'

export default ProjectEventProjector.on(AbandonAnnulé, async (evenement, transaction) => {
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
        type: 'ModificationRequestCancelled',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { modificationRequestId: demandeAbandonId },
      },
      { transaction }
    )
  }
})
