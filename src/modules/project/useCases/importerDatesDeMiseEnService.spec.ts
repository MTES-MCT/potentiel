import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { okAsync } from '@core/utils'

import { makeImporterDatesMiseEnService } from './importerDatesDeMiseEnService'
import {
  ImportDateMiseEnServiceMauvaisFormatError,
  ImportDatesMiseEnServiceDoublonsError,
} from '../errors'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { USER_ROLES } from '@modules/users'

describe(`Commande importerDatesMiseEnService`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const utilisateur = makeFakeUser({ id: 'utilisateur1' })

  describe(`Erreur si l'utilisateur n'a pas les droits`, () => {
    for (const role of USER_ROLES.filter((r) => !['admin', 'dgec-validateur'].includes(r))) {
      it(`Étant donné un utilisateur avec un role autre que admin/dgec-validateur
        Si l'utilisateur a le role ${role}
        Alors une erreur UnauthorizedError devrait être retourné et aucun évènement ne devrait être émis`, async () => {
        const datesDeMiseEnServiceParNumeroDeGestionnaire = [
          {
            numéroGestionnaire: 'ndg01',
            dateDeMiseEnService: '01/01/2023',
          },
        ]

        const importerDatesMiseEnService = makeImporterDatesMiseEnService({
          publishToEventStore,
        })

        const résultat = await importerDatesMiseEnService({
          datesDeMiseEnServiceParNumeroDeGestionnaire,
          utilisateur: { ...utilisateur, role },
        })

        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      })
    }
  })

  describe(`Erreur si une date de mise est mauvais format`, () => {
    it(`Étant donné un fichier comportant une date qui n'est pas au format "dd/mm/aaaa",
        Alors une erreur de type ImportDateMiseEnServiceMauvaisFormatError est retournée`, async () => {
      const datesDeMiseEnServiceParNumeroDeGestionnaire = [
        {
          numéroGestionnaire: 'ndg01',
          dateDeMiseEnService: 'mauvaiseDate',
        },
        {
          numéroGestionnaire: 'ndg01',
          dateDeMiseEnService: '01/01/2022',
        },
      ]

      const importerDatesMiseEnService = makeImporterDatesMiseEnService({
        publishToEventStore,
      })

      const résultat = await importerDatesMiseEnService({
        datesDeMiseEnServiceParNumeroDeGestionnaire,
        utilisateur,
      })
      expect(résultat._unsafeUnwrapErr()[0]).toBeInstanceOf(
        ImportDateMiseEnServiceMauvaisFormatError
      )
    })
  })

  describe(`Erreur si deux lignes avec le même gestionnaire de réseau et deux dates de mise en service différentes`, () => {
    it(`Étant donné un fichier comportant deux lignes avec même numéro de gestionnaire de réseau mais deux dates différentes
        Alors une erreur de type ImportDatesMiseEnServiceDoublonsError est retournée`, async () => {
      const datesDeMiseEnServiceParNumeroDeGestionnaire = [
        {
          numéroGestionnaire: 'ndg01',
          dateDeMiseEnService: '01/01/2023',
        },
        {
          numéroGestionnaire: 'ndg01',
          dateDeMiseEnService: '01/01/2022',
        },
      ]

      const importerDatesMiseEnService = makeImporterDatesMiseEnService({
        publishToEventStore,
      })

      const résultat = await importerDatesMiseEnService({
        datesDeMiseEnServiceParNumeroDeGestionnaire,
        utilisateur,
      })
      expect(résultat._unsafeUnwrapErr()[0]).toBeInstanceOf(ImportDatesMiseEnServiceDoublonsError)
    })
  })

  describe(`Si pas d'erreur émettre un événement ImportDatesDeMiseEnServiceDémarré`, () => {
    it(`Étant donné un fichier comportant une date de mise en service au bon format,
    alors un événement ImportDatesDeMiseEnServiceDémarré devrait être émis`, async () => {
      const datesDeMiseEnServiceParNumeroDeGestionnaire = [
        {
          numéroGestionnaire: 'ndg01',
          dateDeMiseEnService: '01/01/2022',
        },
      ]

      const importerDatesMiseEnService = makeImporterDatesMiseEnService({
        publishToEventStore,
      })

      await importerDatesMiseEnService({ datesDeMiseEnServiceParNumeroDeGestionnaire, utilisateur })

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'ImportDatesDeMiseEnServiceDémarré' })
      )
    })
  })
})
