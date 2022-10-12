import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { User } from '@entities'
import { makeDémarrerImportGestionnaireRéseau } from './démarrerImportGestionnaireRéseau'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { okAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import { USER_ROLES } from '@modules/users'

describe(`Démarrer un import de fichier de gestionnaire réseau`, () => {
  describe(`Démarrer la mise à jour des dates de mise en service au démarrage de l'import`, () => {
    it(`Lorsqu'on démarre un import pour le gestionnaire de réseau Enedis avec des dates de mise en service
        Alors la mise à jour des dates de mise en service est démarrée
        Et l'import pour le gestionnaire de réseau est démarré`, async () => {
      const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo({ état: undefined } as ImportGestionnaireRéseau),
        publishToEventStore,
      })

      const utilisateur = { role: 'admin', id: 'administrateur-potentiel' } as User

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur,
        gestionnaire: 'Enedis',
        données: [
          { numeroGestionnaire: 'NUM-GEST-1', dateMiseEnService: new Date('2024-01-20') },
          { numeroGestionnaire: 'NUM-GEST-2', dateMiseEnService: new Date('2024-02-20') },
        ],
      })

      expect(démarrage.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'MiseAJourDateMiseEnServiceDémarrée',
          payload: expect.objectContaining({
            gestionnaire: 'Enedis',
            dates: [
              {
                numeroGestionnaire: 'NUM-GEST-1',
                dateMiseEnService: new Date('2024-01-20').toISOString(),
              },
              {
                numeroGestionnaire: 'NUM-GEST-2',
                dateMiseEnService: new Date('2024-02-20').toISOString(),
              },
            ],
          }),
        })
      )
      expect(publishToEventStore).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          aggregateId: 'import-gestionnaire-réseau#Enedis',
          type: 'ImportGestionnaireRéseauDémarré',
          payload: expect.objectContaining({
            démarréPar: utilisateur.id,
            gestionnaire: 'Enedis',
          }),
        })
      )
    })
  })

  describe(`Impossible de démarrer un import pour un utilisateur non admin`, () => {
    const rolesNonAutorisés = USER_ROLES.filter((ur) => ur !== 'admin')

    for (const role of rolesNonAutorisés) {
      it(`Lorsqu'un utilisateur ${role} démarre un import pour le gestionnaire de réseau Enedis
        Alors il est averti qu'il n'est pas autorisé à faire un import`, async () => {
        const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

        const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
          importRepo: fakeTransactionalRepo({ état: undefined } as ImportGestionnaireRéseau),
          publishToEventStore,
        })

        const utilisateur = { role, id: 'administrateur-potentiel' } as User

        const démarrage = await démarrerImportGestionnaireRéseau({
          utilisateur,
          gestionnaire: 'Enedis',
          données: [],
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
        Alors on est averti qu'il impossible de démarrer un import alors qu'un est déjà en cours`, async () => {
      const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo({ état: 'en cours' } as ImportGestionnaireRéseau),
        publishToEventStore,
      })

      const utilisateur = { role: 'admin', id: 'administrateur-potentiel' } as User

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur,
        gestionnaire: 'Enedis',
        données: [],
      })

      expect(démarrage.isErr()).toBe(true)
      expect(démarrage._unsafeUnwrapErr()).toBeInstanceOf(DémarrageImpossibleError)

      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
