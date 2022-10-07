import { InfraNotAvailableError } from '@modules/shared'
import { okAsync } from '@core/utils'

import { makeImporterDatesMiseEnService } from './importerDatesDeMiseEnService'
import {
  ImportDateMiseEnServiceManquanteError,
  ImportDateMiseEnServiceMauvaisFormatError,
  ImportDatesMiseEnServiceDoublonsError,
} from '../errors'
import makeFakeUser from '../../../__tests__/fixtures/user'

describe(`Commande importerDatesMiseEnService`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const utilisateur = makeFakeUser({ id: 'utilisateur1' })

  describe(`Erreur si une date de mise en service est manquante dans le fichier`, () => {
    it(`Étant donné un fichier comportant une ligne avec un numéro gestionnaire bien renseigné mais une date de mise en service manquante,
        Alors une erreur de type ImportDateMiseEnServiceManquanteError est retournée et aucun évènement n'est publié`, async () => {
      const datesDeMiseEnServiceParNumeroDeGestionnaire = [
        {
          numéroGestionnaire: 'ndg01',
        },
      ]

      const importerDatesMiseEnService = makeImporterDatesMiseEnService({
        publishToEventStore,
      })

      const résultat = await importerDatesMiseEnService({
        datesDeMiseEnServiceParNumeroDeGestionnaire,
        utilisateur,
      })

      expect(résultat._unsafeUnwrapErr()[0]).toBeInstanceOf(ImportDateMiseEnServiceManquanteError)
    })
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
