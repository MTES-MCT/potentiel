import { UniqueEntityID } from '@core/domain'
import { ModificationReceived } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationReceived,
  async (
    { payload: { projectId, type, producteur, actionnaire, fournisseurs }, occurredAt },
    transaction
  ) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ModificationReceived.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),

        payload: {
          modificationType: type,
          ...(type === 'producteur' && { producteur }),
          ...(type === 'actionnaire' && { actionnaire }),
          ...(type === 'fournisseurs' && { fournisseurs }),
        },
      },
      { transaction }
    )
  }
)
