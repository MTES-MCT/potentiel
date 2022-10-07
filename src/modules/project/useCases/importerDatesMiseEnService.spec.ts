import { InfraNotAvailableError } from '@modules/shared'
import { okAsync } from '@core/utils'

import { makeImporterDatesMiseEnService } from './importerDatesMiseEnService'
import { ImportDateMiseEnServiceManquanteError } from '../errors'

describe(`Commande importerDatesMiseEnService`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  describe(`Erreur si une date de mise en service est manquante dans le fichier`, () => {
    it(`Étant donné un fichier comportant une ligne avec un numéro gestionnaire bien renseigné mais une date de mise en service manquante,
        Alors une erreur de type ImportDateMiseEnServiceManquanteError est retournée et aucun évènement n'est publié`, async () => {
      const importData = [
        {
          numéroGestionnaire: 'ndg01',
        },
      ]

      const importerDatesMiseEnService = makeImporterDatesMiseEnService({
        publishToEventStore,
      })

      const résultat = await importerDatesMiseEnService({ importData })
      expect(résultat._unsafeUnwrapErr()[0]).toBeInstanceOf(ImportDateMiseEnServiceManquanteError)
    })
  })
  // describe(`Erreur si une date de mise en service présentes dans le fichier sont au mauvais format`, () => {
  //   it(`Étant donné un fichier comportant deux lignes avec un numéro de gestionnaire identique mais deux dates de mise en service différentes,
  //       Alors une erreur de type ImportDatesMiseEnServiceDoublonsExistantError est retournée et aucun évènement n'est publié `)
  // })
  // describe(`Erreur si le fichier importé contient des numéros de gestionnaire en doublons`, () => {
  //   it(`Étant donné un fichier comportant deux lignes avec un numéro de gestionnaire identique mais deux dates de mise en service différentes,
  //       Alors une erreur de type ImportDatesMiseEnServiceDoublonsExistant est retournée et aucun évènement n'est publié `)
  // })
})
