import { UniqueEntityID } from '@core/domain'
import { ModificationRequested } from '@modules/modificationRequest'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AbandonDemandé } from '../../../../../../modules/demandeModification'

export default ProjectEventProjector.on(
  AbandonDemandé,
  async ({ payload, occurredAt }, transaction) => {
    const { projetId, demandeAbandonId, autorité } = payload

    await ProjectEvent.create(
      {
        projectId: projetId,
        type: 'ModificationRequested',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          modificationType: 'abandon',
          modificationRequestId: demandeAbandonId,
          authority: autorité,
        },
      },
      { transaction }
    )
  }
)
