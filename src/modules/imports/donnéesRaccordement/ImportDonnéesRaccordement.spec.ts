import { UniqueEntityID } from '@core/domain'
import { makeImportDonnéesRaccordement } from './ImportDonnéesRaccordement'
import {
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
  TâcheMiseAJourDonnéesDeRaccordementTerminée,
} from './events'

describe(`Fabriquer l'agrégat pour un import de données de raccordement`, () => {
  it(`Quand on fabrique l'import de données de raccordement avec un évènement 'TâcheMiseAJourDonnéesDeRaccordementDémarrée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importDonnéesRaccordement = makeImportDonnéesRaccordement({
      id: new UniqueEntityID('import-données-raccordement#Enedis'),
      events: [
        new TâcheMiseAJourDonnéesDeRaccordementDémarrée({
          payload: {
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            données: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20'),
                dateFileAttente: new Date('2023-12-31'),
              },
            ],
          },
        }),
      ],
    })

    expect(importDonnéesRaccordement.isOk()).toBe(true)
    expect(importDonnéesRaccordement._unsafeUnwrap()).toMatchObject({
      état: 'en cours',
    })
  })
  it(`Quand on fabrique l'import de données de raccordement avec 2 évènements consécutifs 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' et 'TâcheMiseAJourDonnéesDeRaccordementTerminée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importDonnéesRaccordement = makeImportDonnéesRaccordement({
      id: new UniqueEntityID('import-données-raccordement#Enedis'),
      events: [
        new TâcheMiseAJourDonnéesDeRaccordementDémarrée({
          payload: {
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            données: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20'),
                dateFileAttente: new Date('2023-12-31'),
              },
            ],
          },
        }),
        new TâcheMiseAJourDonnéesDeRaccordementTerminée({
          payload: {
            gestionnaire: 'Enedis',
            résultat: [],
          },
        }),
      ],
    })

    expect(importDonnéesRaccordement.isOk()).toBe(true)
    expect(importDonnéesRaccordement._unsafeUnwrap()).toMatchObject({
      état: 'terminé',
    })
  })
})
