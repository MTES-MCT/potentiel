import { UniqueEntityID } from '@core/domain'
import { DélaiDemandé, DélaiDemandéPayload } from '@modules/demandeModification'
import { makeDemandeDélai } from './DemandeDélai'

describe(`Charger l'agrégat pour une demande de délai`, () => {
  it(`
        Etant donné un délai demandé
        Quand on charge la demande de délai
        Alors la demande a un statut 'envoyée'
        Et l'identifiant du projet est récupéré`, () => {
    const fabricationDemandeDélai = makeDemandeDélai({
      id: new UniqueEntityID('la-demande'),
      events: [
        new DélaiDemandé({
          payload: {
            projetId: 'le-projet-de-la-demande',
          } as DélaiDemandéPayload,
        }),
      ],
    })

    expect(fabricationDemandeDélai.isOk()).toBe(true)
    fabricationDemandeDélai.isOk() &&
      expect(fabricationDemandeDélai.value).toMatchObject({
        projet: {
          id: { value: 'le-projet-de-la-demande' },
        },
        statut: 'envoyée',
      })
  })
})
