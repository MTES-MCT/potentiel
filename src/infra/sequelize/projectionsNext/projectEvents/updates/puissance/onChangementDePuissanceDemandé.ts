import { UniqueEntityID } from '@core/domain'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(
  ChangementDePuissanceDemandé,
  async ({ payload, occurredAt }, transaction) => {
    const { autorité, puissance, demandeChangementDePuissanceId, projetId } = payload

    await ProjectEvent.create(
      {
        projectId: projetId,
        type: 'ChangementDePuissanceDemandé',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          statut: 'envoyée',
          modificationType: 'puissance',
          modificationRequestId: demandeChangementDePuissanceId,
          autorité,
          puissance,
        },
      },
      { transaction }
    )
  }
)
