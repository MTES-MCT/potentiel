import { UniqueEntityID } from '@core/domain'
import { DélaiDemandé, DélaiDemandéPayload } from '@modules/demandeModification'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiDemandé from './onDélaiDemandé'

describe('Projecteur de ProjectEvent onDélaiDemandé', () => {
  describe(`Lorsque'un événement DélaiDemandé est émis,`, () => {
    it(`une nouvelle entrée de type "DemandeDélai",
      avec un type "envoyée" en payload,
      devrait être enregistrée dans la projection.`, async () => {
      const demandeDélaiId = new UniqueEntityID().toString()
      const projetId = new UniqueEntityID().toString()

      await onDélaiDemandé(
        new DélaiDemandé({
          payload: {
            demandeDélaiId: demandeDélaiId,
            projetId: projetId,
            autorité: 'dreal',
            fichierId: 'id-fichier',
            justification: 'en retard',
            dateAchèvementDemandée: new Date('2022-06-25').toISOString(),
            porteurId: new UniqueEntityID().toString(),
          } as DélaiDemandéPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-06-25'),
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        id: demandeDélaiId,
        type: 'DemandeDélai',
        payload: {
          statut: 'envoyée',
          demandeDélaiId,
        },
      })
    })
  })
})
