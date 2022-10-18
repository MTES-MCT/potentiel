import { UniqueEntityID } from '@core/domain'
import { makeImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { MiseAJourDateMiseEnServiceDémarrée, MiseAJourDateMiseEnServiceTerminée } from './events'

describe(`Fabriquer l'agrégat pour un import de gestionnaire de réseau`, () => {
  it(`Quand on fabrique l'import de gestionnaire de réseau avec un évènement 'MiseAJourDateMiseEnServiceDémarrée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new MiseAJourDateMiseEnServiceDémarrée({
          payload: {
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            dates: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
            ],
          },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    expect(importGestionnaireRéseau._unsafeUnwrap()).toMatchObject({
      état: 'en cours',
      tâchesEnCours: [
        {
          type: 'maj-date-mise-en-service',
        },
      ],
    })
  })
  it(`Quand on fabrique l'import de gestionnaire de réseau avec 2 évènements consécutifs 'MiseAJourDateMiseEnServiceDémarrée' et 'MiseAJourDateMiseEnServiceTerminée'
      Alors l'import devrait avoir une tâche en cours de type mise à jour de date de mise en service
      Et l'import devrait avoir un statut 'en cours'`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new MiseAJourDateMiseEnServiceDémarrée({
          payload: {
            misAJourPar: 'admin',
            gestionnaire: 'Enedis',
            dates: [
              {
                identifiantGestionnaireRéseau: 'Enedis',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
            ],
          },
        }),
        new MiseAJourDateMiseEnServiceTerminée({
          payload: {
            gestionnaire: 'Enedis',
            résultat: [],
          },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    expect(importGestionnaireRéseau._unsafeUnwrap()).toMatchObject({
      état: 'terminé',
      tâchesEnCours: [],
    })
  })
})
