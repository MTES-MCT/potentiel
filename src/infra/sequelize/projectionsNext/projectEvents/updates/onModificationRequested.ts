import { UniqueEntityID } from '@core/domain'
import { ModificationRequested } from '@modules/modificationRequest'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequested,
  async ({ payload, occurredAt }, transaction) => {
    const { projectId, type, modificationRequestId, authority, requestedBy } = payload

    if (!['delai', 'abandon', 'recours', 'puissance'].includes(type)) {
      return
    }

    if (type === 'delai') {
      const demandeExistante = await ProjectEvent.findOne({
        where: { id: modificationRequestId },
        transaction,
      })

      if (!demandeExistante) {
        await ProjectEvent.create(
          {
            id: modificationRequestId,
            projectId,
            type: 'DemandeDélai',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: {
              statut: 'envoyée',
              autorité: authority,
              délaiEnMoisDemandé: payload.delayInMonths,
              demandeur: requestedBy,
            },
          },
          { transaction }
        )
      }

      return
    }

    await ProjectEvent.create(
      {
        projectId,
        type: 'ModificationRequested',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          modificationType: type,
          modificationRequestId,
          authority,
          ...(type === 'puissance' && { puissance: payload.puissance }),
        },
      },
      { transaction }
    )
  }
)
