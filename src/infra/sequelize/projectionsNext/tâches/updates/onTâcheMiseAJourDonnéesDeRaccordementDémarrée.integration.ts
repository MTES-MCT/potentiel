import { resetDatabase } from '../../../helpers'
import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '@modules/imports/donnéesRaccordement'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDonnéesDeRaccordementDémarrée from './onTâcheMiseAJourDonnéesDeRaccordementDémarrée'

describe('Handler onTâcheMiseAJourDonnéesDeRaccordementDémarrée', () => {
  const occurredAt = new Date('2022-01-04')
  const gestionnaire = 'Enedis'

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Lorsqu'un évènement de type 'TâcheMiseAJourDonnéesDeRaccordementDémarrée' survient
      Alors une nouvelle tâche 'en cours' de mise a jour de date de mise en service devrait être créée avec :
        - le gestionnaire 
        - la date de début`, async () => {
    await onTâcheMiseAJourDonnéesDeRaccordementDémarrée(
      new TâcheMiseAJourDonnéesDeRaccordementDémarrée({
        payload: {
          misAJourPar: 'misAJourPar-id',
          gestionnaire,
          dates: [],
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const tâche = await Tâches.findOne({
      where: {
        gestionnaire,
        type: 'maj-données-de-raccordement',
        état: 'en cours',
        dateDeDébut: occurredAt,
      },
    })

    expect(tâche).not.toBeNull()
    expect(tâche).toMatchObject({
      id: expect.any(Number),
      gestionnaire,
      état: 'en cours',
      type: 'maj-données-de-raccordement',
      dateDeDébut: occurredAt,
    })
  })
})
