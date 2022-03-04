import { UniqueEntityID } from '@core/domain'
import { ModificationReceived } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationReceived,
  async ({ payload, occurredAt }, transaction) => {
    const { projectId, type, producteur, actionnaire, fournisseurs, puissance } = payload
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
              producteur,
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
              actionnaire,
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
              fournisseurs,
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
              puissance,
            },
          },
          { transaction }
        )
        break
    }
  }
)
