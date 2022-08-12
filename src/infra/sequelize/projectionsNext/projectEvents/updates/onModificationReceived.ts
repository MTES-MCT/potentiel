import { UniqueEntityID } from '@core/domain'
import { ModificationReceived } from '@modules/modificationRequest'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationReceived,
  async ({ payload, occurredAt }, transaction) => {
    const { projectId, type, modificationRequestId } = payload
    const common = {
      projectId,
      type: ModificationReceived.type,
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      id: new UniqueEntityID().toString(),
    }

    switch (type) {
      case 'producteur':
        await ProjectEvent.create(
          {
            ...common,
            payload: {
              modificationType: type,
              producteur: payload.producteur,
              modificationRequestId,
            },
          },
          { transaction }
        )
        break
      case 'actionnaire':
        await ProjectEvent.create(
          {
            ...common,
            payload: {
              modificationType: type,
              actionnaire: payload.actionnaire,
              modificationRequestId,
            },
          },
          { transaction }
        )
        break
      case 'fournisseur':
        await ProjectEvent.create(
          {
            ...common,
            payload: {
              modificationType: type,
              fournisseurs: payload.fournisseurs,
              modificationRequestId,
            },
          },
          { transaction }
        )
        break
      case 'puissance':
        await ProjectEvent.create(
          {
            ...common,
            payload: {
              modificationType: type,
              puissance: payload.puissance,
              modificationRequestId,
            },
          },
          { transaction }
        )
        break
    }
  }
)
