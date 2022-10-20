import { UniqueEntityID } from '@core/domain'
import { makeImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import {
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  TâcheMiseAJourDatesMiseEnServiceTerminée,
} from './events'

describe(`Fabriquer l'agrégat pour un import de gestionnaire de réseau`, () => {
  it(`Quand on fabrique l'import de gestionnaire de réseau avec un évènement 'TâcheMiseAJourDatesMiseEnServiceDémarrée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new TâcheMiseAJourDatesMiseEnServiceDémarrée({
          payload: {
            tâcheId: '1577836800000#maj-date-mise-en-service',
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            dates: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
            ],
          },
          original: { version: 1, occurredAt: new Date('2020-01-01') },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    expect(importGestionnaireRéseau._unsafeUnwrap()).toMatchObject({
      état: 'en cours',
      dateDeDébut: new Date('2020-01-01').getTime(),
      tâchesEnCours: [
        {
          type: 'maj-date-mise-en-service',
        },
      ],
    })
  })
  it(`Quand on fabrique l'import de gestionnaire de réseau avec 2 évènements consécutifs 'TâcheMiseAJourDatesMiseEnServiceDémarrée' et 'TâcheMiseAJourDatesMiseEnServiceTerminée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new TâcheMiseAJourDatesMiseEnServiceDémarrée({
          payload: {
            tâcheId: '1577836800000#maj-date-mise-en-service',
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            dates: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
            ],
          },
          original: { version: 1, occurredAt: new Date('2020-01-01') },
        }),
        new TâcheMiseAJourDatesMiseEnServiceTerminée({
          payload: {
            tâcheId: '1577836800000#maj-date-mise-en-service',
            gestionnaire: 'Enedis',
            résultat: [],
          },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    expect(importGestionnaireRéseau._unsafeUnwrap()).toMatchObject({
      dateDeDébut: new Date('2020-01-01').getTime(),
      état: 'terminé',
      tâchesEnCours: [],
    })
  })
})
