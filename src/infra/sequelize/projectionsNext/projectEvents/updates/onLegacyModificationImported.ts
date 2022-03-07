import { LegacyModificationImported } from '@modules/modificationRequest'
import { UniqueEntityID } from '@core/domain'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  LegacyModificationImported,
  async ({ payload: { projectId, modifications }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: { projectId, type: 'LegacyModificationImported' },
      transaction,
    })

    for (const modification of modifications) {
      const common = {
        id: new UniqueEntityID().toString(),
        projectId,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: modification.modifiedOn,
        type: 'LegacyModificationImported',
      }
      switch (modification.type) {
        case 'abandon':
          await ProjectEvent.create(
            {
              ...common,
              payload: { modificationType: 'abandon' },
            },
            { transaction }
          )
          break
        case 'recours':
          await ProjectEvent.create(
            {
              ...common,
              payload: { modificationType: 'recours', accepted: modification.accepted },
            },
            { transaction }
          )
          break
        case 'delai':
          const ancienneDateLimiteAchevement = modification.ancienneDateLimiteAchevement
          const nouvelleDateLimiteAchevement = modification.nouvelleDateLimiteAchevement
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'delai',
                ancienneDateLimiteAchevement,
                nouvelleDateLimiteAchevement,
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
                modificationType: 'actionnaire',
                actionnairePrecedent: modification.actionnairePrecedent,
              },
            },
            { transaction }
          )
          break
        case 'producteur':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'producteur',
                producteurPrecedent: modification.producteurPrecedent,
              },
            },
            { transaction }
          )
          break
        case 'autre':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'autre',
                column: modification.column,
                value: modification.value,
              },
            },
            { transaction }
          )
          break
      }
    }
  }
)
