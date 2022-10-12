import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates'
import { User } from '@entities'
import { makeDémarrerImportGestionnaireRéseau } from './démarrerImportGestionnaireRéseau'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { InfraNotAvailableError } from '@modules/shared'
import { okAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'

describe(`Démarrer un import de fichier de gestionnaire réseau`, () => {
  describe(`Démarrer un import pour un gestionnaire de réseau`, () => {
    it(`Lorsqu'on démarre un import pour le gestionnaire de réseau Enedis
        Alors un import pour le gestionnaire de réseau est en cours`, async () => {
      const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

      const démarrerImportGestionnaireRéseau = makeDémarrerImportGestionnaireRéseau({
        importRepo: fakeTransactionalRepo({ état: undefined } as ImportGestionnaireRéseau),
        publishToEventStore,
      })

      const utilisateur = { role: 'admin', id: 'administrateur-potentiel' } as User

      const démarrage = await démarrerImportGestionnaireRéseau({
        utilisateur,
        gestionnaire: 'Enedis',
      })

      expect(démarrage.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ImportGestionnaireRéseauDémarré',
          payload: expect.objectContaining({
            démarréPar: utilisateur.id,
            gestionnaire: 'Enedis',
          }),
        })
      )
    })
  })

  describe(`Impossible de démarrer un import ejà en cours pour le même gestionnaire de réseau`, () => {
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
      })

      expect(démarrage.isErr()).toBe(true)
      expect(démarrage._unsafeUnwrapErr()).toBeInstanceOf(DémarrageImpossibleError)

      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })
})
