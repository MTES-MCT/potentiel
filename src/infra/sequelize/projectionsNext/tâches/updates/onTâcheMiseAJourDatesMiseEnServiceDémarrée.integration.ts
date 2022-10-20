import { resetDatabase } from '../../../helpers'
import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '@modules/imports/gestionnaireRéseau'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDatesMiseEnServiceDémarrée from './onTâcheMiseAJourDatesMiseEnServiceDémarrée'

describe('Handler onTâcheMiseAJourDatesMiseEnServiceDémarrée', () => {
  const occurredAt = new Date('2022-01-04')

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Lorsque un énement de type 'TâcheMiseAJourDatesMiseEnServiceDémarrée' survient
      Alors une nouvelle tâche devrait être inséréé dans Tasks avec le type 'maj-date-mise-en-service'`, async () => {
    await onTâcheMiseAJourDatesMiseEnServiceDémarrée(
      new TâcheMiseAJourDatesMiseEnServiceDémarrée({
        payload: {
          tâcheId: 'tâche-id',
          misAJourPar: 'misAJourPar-id',
          gestionnaire: 'Enedis',
          dates: [],
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const tâche = await Tâches.findOne({
      where: { id: 'tâche-id' },
    })

    expect(tâche).toMatchObject({
      id: 'tâche-id',
      type: 'maj-date-mise-en-service',
      dateDeDébut: occurredAt,
    })
  })
})
