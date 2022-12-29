import { UniqueEntityID } from '@core/domain'

import { makeDemandeChangementDePuissance } from './DemandeChangementDePuissance'
import { ChangementDePuissanceDemandé, ChangementDePuissanceDemandéPayload } from './events'

describe(`Fabriquer l'agrégat pour une demande de changement de puissance`, () => {
  it(`
        Quand on fabrique la demande de changement de puissance avec un évenement 'ChangementDePuissanceDemandé'
        Si la puissance rentre dans les conditions et qu'elle est autoacceptée
        Alors la demande a un statut 'accordée'`, () => {
    const demandeChangementDePuissance = makeDemandeChangementDePuissance({
      id: new UniqueEntityID('la-demande'),
      events: [
        new ChangementDePuissanceDemandé({
          payload: {
            demandeId: 'la-demande',
          } as ChangementDePuissanceDemandéPayload,
        }),
      ],
    })

    expect(demandeChangementDePuissance.isOk()).toBe(true)
    demandeChangementDePuissance.isOk() &&
      expect(demandeChangementDePuissance.value).toMatchObject({
        statut: 'accordée',
      })
  })
})
