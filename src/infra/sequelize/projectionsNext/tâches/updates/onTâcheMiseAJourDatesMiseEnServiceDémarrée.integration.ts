import { resetDatabase } from '../../../helpers'
import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '@modules/imports/gestionnaireRéseau'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDatesMiseEnServiceDémarrée from './onTâcheMiseAJourDatesMiseEnServiceDémarrée'

describe('Handler onTâcheMiseAJourDatesMiseEnServiceDémarrée', () => {
  const occurredAt = new Date('2022-01-04')
  const gestionnaire = 'Enedis'

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Lorsque un énement de type 'TâcheMiseAJourDatesMiseEnServiceDémarrée' survient
      Alors une nouvelle tâche devrait être inséréé dans Tasks avec le type 'maj-date-mise-en-service'`, async () => {
    await onTâcheMiseAJourDatesMiseEnServiceDémarrée(
      new TâcheMiseAJourDatesMiseEnServiceDémarrée({
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
        type: 'maj-date-mise-en-service',
        état: 'en cours',
        dateDeDébut: occurredAt,
      },
    })

    expect(tâche).not.toBeNull()
    expect(tâche).toMatchObject({
      gestionnaire,
      état: 'en cours',
      type: 'maj-date-mise-en-service',
      dateDeDébut: occurredAt,
    })
  })
})
