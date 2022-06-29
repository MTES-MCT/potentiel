import { UniqueEntityID } from '@core/domain'
import { DélaiDemandé, DélaiDemandéPayload } from './demander'
import { DélaiAccordé, DélaiAccordéPayload } from './accorder'
import { makeDemandeDélai } from './DemandeDélai'

describe(`Charger l'agrégat pour une demande de délai`, () => {
  it(`
        Etant donné un délai demandé
        Quand on charge la demande de délai
        Alors la demande a un statut 'envoyée'
        Et l'identifiant du projet est récupéré`, () => {
    const demandeDélai = makeDemandeDélai({
      id: new UniqueEntityID('la-demande'),
      events: [
        new DélaiDemandé({
          payload: {
            projetId: 'le-projet-de-la-demande',
          } as DélaiDemandéPayload,
        }),
      ],
    })

    expect(demandeDélai.isOk()).toBe(true)
    demandeDélai.isOk() &&
      expect(demandeDélai.value).toMatchObject({
        projet: {
          id: { value: 'le-projet-de-la-demande' },
        },
        statut: 'envoyée',
      })
  })

  it(`
        Etant donné un délai accordé
        Quand on charge la demande de délai
        Alors la demande a un statut 'accordée'`, () => {
    const demandeDélai = makeDemandeDélai({
      id: new UniqueEntityID('la-demande'),
      events: [
        new DélaiAccordé({
          payload: {
            demandeDélaiId: 'la-demande',
          } as DélaiAccordéPayload,
        }),
      ],
    })

    expect(demandeDélai.isOk()).toBe(true)
    demandeDélai.isOk() &&
      expect(demandeDélai.value).toMatchObject({
        statut: 'accordée',
      })
  })
})
