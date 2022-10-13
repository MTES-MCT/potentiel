import { User } from '@entities'
import { okAsync } from '@core/utils'
import { USER_ROLES } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates'
import { ImportGestionnaireRéseau } from '../ImportGestionnaireRéseau'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import { DonnéesDeMiseAJourObligatoiresError } from './DonnéesDeMiseAJourObligatoiresError'
import { makeDémarrerImportGestionnaireRéseau } from './démarrerImportGestionnaireRéseau'

describe(`Démarrer un import de fichier de gestionnaire réseau`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const importDémarrable = { état: undefined } as ImportGestionnaireRéseau
  const utilisateurAutorisé = { role: 'admin', id: 'administrateur-potentiel' } as User
  const donnéesImportValides = [
    { identifiantGestionnaireRéseau: 'NUM-GEST-1', dateMiseEnService: new Date('2024-01-20') },
    { identifiantGestionnaireRéseau: 'NUM-GEST-2', dateMiseEnService: new Date('2024-02-20') },
  ]

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Démarrer la mise à jour des dates de mise en service au démarrage de l'import`, () => {
    it(`Lorsqu'on démarre un import pour le gestionnaire de réseau Enedis avec des dates de mise en service
        Alors la mise à jour des dates de mise en service est démarrée`, async () => {
      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo(importDémarrable),
        publishToEventStore,
      })

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur: utilisateurAutorisé,
        gestionnaire: 'Enedis',
        données: donnéesImportValides,
      })

      expect(démarrage.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'MiseAJourDateMiseEnServiceDémarrée',
          payload: expect.objectContaining({
            misAJourPar: utilisateurAutorisé.id,
            gestionnaire: 'Enedis',
            dates: [
              {
                identifiantGestionnaireRéseau: 'NUM-GEST-1',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
              {
                identifiantGestionnaireRéseau: 'NUM-GEST-2',
                dateMiseEnService: new Date('2024-02-20').toISOString(),
              },
            ],
          }),
        })
      )
    })
  })

  describe(`Impossible de démarrer un import pour un utilisateur non admin`, () => {
    const rolesNonAutorisés = USER_ROLES.filter((ur) => ur !== 'admin')

    for (const role of rolesNonAutorisés) {
      it(`Lorsqu'un utilisateur ${role} démarre un import pour le gestionnaire de réseau Enedis
          Alors il devrait être averti qu'il n'est pas autorisé à faire un import`, async () => {
        const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
          importRepo: fakeTransactionalRepo(importDémarrable),
          publishToEventStore,
        })

        const démarrage = await démarrerImportGestionnaireRéseau({
          utilisateur: { role, id: 'administrateur-potentiel' } as User,
          gestionnaire: 'Enedis',
          données: donnéesImportValides,
        })

        expect(démarrage.isErr()).toBe(true)
        expect(démarrage._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }
  })

  describe(`Impossible de démarrer un import déjà en cours pour le même gestionnaire de réseau`, () => {
    it(`Étant donné un import en cours pour le gestionnaire de réseau Enedis
        Lorsqu'on démarre un import pour le gestionnaire de réseau Enedis
        Alors on devrait être averti qu'il impossible de démarrer un import alors qu'un est déjà en cours`, async () => {
      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo({ état: 'en cours' } as ImportGestionnaireRéseau),
        publishToEventStore,
      })

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur: utilisateurAutorisé,
        gestionnaire: 'Enedis',
        données: donnéesImportValides,
      })

      expect(démarrage.isErr()).toBe(true)
      expect(démarrage._unsafeUnwrapErr()).toBeInstanceOf(DémarrageImpossibleError)

      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de démarrer un import sans données de mise à jour`, () => {
    it(`Lorsqu'on démarre un import sans données de mise à jour
        Alors on devrait être averti qu'il faut des données de mise à jour pour pouvoir démarrer l'import`, async () => {
      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo(importDémarrable),
        publishToEventStore,
      })

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur: utilisateurAutorisé,
        gestionnaire: 'Enedis',
        données: [],
      })

      expect(démarrage.isErr()).toBe(true)
      expect(démarrage._unsafeUnwrapErr()).toBeInstanceOf(DonnéesDeMiseAJourObligatoiresError)

      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
