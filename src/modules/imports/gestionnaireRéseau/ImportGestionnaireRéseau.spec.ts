import { UniqueEntityID } from '@core/domain'
import { makeImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { ImportGestionnaireRéseauDémarré, MiseAJourDateMiseEnServiceDémarrée } from './events'

describe(`Fabriquer l'agrégat pour un import de gestionnaire de réseau`, () => {
  it(`Quand on fabrique l'import de gestionnaire de réseau avec un évenement 'ImportGestionnaireRéseauDémarré'
      Alors l'import a un statut 'en cours'`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new ImportGestionnaireRéseauDémarré({
          payload: {
            démarréPar: 'un-admin',
            gestionnaire: 'Enedis',
          },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    importGestionnaireRéseau.isOk() &&
      expect(importGestionnaireRéseau.value).toMatchObject({
        état: 'en cours',
        tâchesEnCours: [],
      })
  })

  it(`Quand on fabrique l'import de gestionnaire de réseau avec un évenement 'MiseAJourDateMiseEnServiceDémarrée'
      Alors l'import a une tâche en cours de type mise à jour de date de mise en service`, () => {
    const importGestionnaireRéseau = makeImportGestionnaireRéseau({
      id: new UniqueEntityID('import-gestionnaire-réseau#Enedis'),
      events: [
        new MiseAJourDateMiseEnServiceDémarrée({
          payload: {
            gestionnaire: 'Enedis',
            dates: [
              {
                numeroGestionnaire: 'Enedis',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
            ],
          },
        }),
      ],
    })

    expect(importGestionnaireRéseau.isOk()).toBe(true)
    expect(importGestionnaireRéseau._unsafeUnwrap()).toMatchObject({
      tâchesEnCours: [
        {
          type: 'maj-date-mise-en-service',
        },
      ],
    })
  })
})
