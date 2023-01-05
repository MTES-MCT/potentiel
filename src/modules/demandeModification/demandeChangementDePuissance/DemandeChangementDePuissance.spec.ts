import { UniqueEntityID } from '@core/domain'

import { makeDemandeChangementDePuissance } from './DemandeChangementDePuissance'
import { ChangementDePuissanceDemandé, ChangementDePuissanceDemandéPayload } from './events'

describe(`Fabriquer l'agrégat pour une demande de changement de puissance`, () => {
  it(`
        Quand on fabrique la demande de changement de puissance avec un évenement 'ChangementDePuissanceDemandé'
        Alors la demande a un statut 'envoyée'
        Et l'identifiant du projet est récupéré`, () => {
    const demandeChangementDePuissance = makeDemandeChangementDePuissance({
      id: new UniqueEntityID('la-demande'),
      events: [
        new ChangementDePuissanceDemandé({
          payload: {
            projetId: 'le-projet-de-la-demande',
          } as ChangementDePuissanceDemandéPayload,
        }),
      ],
    })

    expect(demandeChangementDePuissance.isOk()).toBe(true)
    demandeChangementDePuissance.isOk() &&
      expect(demandeChangementDePuissance.value).toMatchObject({
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      })
  })
})
