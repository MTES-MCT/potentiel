import { UniqueEntityID } from '@core/domain'
import { makeImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { ImportGestionnaireRéseauDémarré } from './events'

describe(`Fabriquer l'agrégat pour un import de gestionnaire de réseau`, () => {
  it(`Quand on fabrique limport de gestionnaire de réseau avec un évenement 'ImportGestionnaireRéseauDémarré'
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
      })
  })
})
