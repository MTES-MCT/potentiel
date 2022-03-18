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
      const filename = modification.filename
      switch (modification.type) {
        case 'abandon':
          await ProjectEvent.create(
            {
              ...common,
              payload: { modificationType: 'abandon', accepted: modification.accepted, filename },
            },
            { transaction }
          )
          break
        case 'recours':
          await ProjectEvent.create(
            {
              ...common,
              payload: { modificationType: 'recours', accepted: modification.accepted, filename },
            },
            { transaction }
          )
          break
        case 'delai':
          if (modification.accepted) {
            await ProjectEvent.create(
              {
                ...common,
                payload: {
                  modificationType: 'delai',
                  accepted: true,
                  ancienneDateLimiteAchevement: modification.ancienneDateLimiteAchevement,
                  nouvelleDateLimiteAchevement: modification.nouvelleDateLimiteAchevement,
                  filename,
                },
              },
              { transaction }
            )
          } else {
            await ProjectEvent.create(
              {
                ...common,
                payload: {
                  modificationType: 'delai',
                  accepted: false,
                  filename,
                },
              },
              { transaction }
            )
          }
          break
        case 'actionnaire':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'actionnaire',
                actionnairePrecedent: modification.actionnairePrecedent,
                filename,
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
                filename,
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
                filename,
              },
            },
            { transaction }
          )
          break
      }
    }
  }
)
