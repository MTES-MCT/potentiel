import { UniqueEntityID } from '@core/domain'
import { ModificationRequested, ModificationRequestedPayload } from '@modules/modificationRequest'

import { makeDemandeDélai } from './DemandeDélai'
import {
  DélaiAccordé,
  DélaiAccordéPayload,
  DélaiDemandé,
  DélaiDemandéPayload,
  DélaiRejeté,
  DélaiRejetéPayload,
} from './events'

describe(`Fabriquer l'agrégat pour une demande de délai`, () => {
  it(`
        Quand on fabrique la demande de délai avec un évenement 'DélaiDemandé'
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
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      })
  })

  it(`
        Quand on fabrique la demande de délai avec un évenement 'DélaiAccordé'
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

describe(`Fabriquer l'agrégat d'une demande de délai utilisant l'ancien et le nouveau format de demande`, () => {
  describe(`Etant donné une demande de délai dont l'acceptation correspond à un événement générique ModificationRequested
    et donc le rejet corresond à un événement spécifique DélaiRejeté`, () => {
    it(`On doit obtenir un agrégat prenant en compte les informations des deux types d'événements`, () => {
      const demandeDélai = makeDemandeDélai({
        id: new UniqueEntityID('la-demande'),
        events: [
          new ModificationRequested({
            payload: {
              type: 'delai',
              modificationRequestId: 'la-demande',
            } as ModificationRequestedPayload,
          }),
          new DélaiRejeté({
            payload: {
              demandeDélaiId: 'la-demande',
            } as DélaiRejetéPayload,
          }),
        ],
      })

      expect(demandeDélai.isOk()).toBe(true)
      demandeDélai.isOk() &&
        expect(demandeDélai.value).toMatchObject({
          statut: 'refusée',
        })
    })
  })
})
