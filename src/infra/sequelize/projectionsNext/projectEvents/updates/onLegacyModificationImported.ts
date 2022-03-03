import { LegacyModificationImported } from '@modules/modificationRequest'
import { UniqueEntityID } from '@core/domain'
import { ProjectEvent } from '../projectEvent.model'
import { logger } from '@core/utils'

export default ProjectEvent.projector.on(
  LegacyModificationImported,
  async ({ payload: { projectId, modifications }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({ where: { projectId, type: 'LegacyModificationImported' } })

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
          const delayInMonths = getDelayInMonths(
            modification.ancienneDateLimiteAchevement,
            modification.nouvelleDateLimiteAchevement
          )
          await ProjectEvent.create(
            {
              ...common,
              payload: { modificationType: 'delai', delayInMonths },
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
      }
    }
  }
)

const getDelayInMonths = (d1: number, d2: number): number => {
  const date1 = new Date(d1)
  const date2 = new Date(d2)
  let months: number
  months = (date2.getFullYear() - date1.getFullYear()) * 12
  months -= date1.getMonth()
  months += date2.getMonth()
  return months <= 0 ? 0 : months
}
