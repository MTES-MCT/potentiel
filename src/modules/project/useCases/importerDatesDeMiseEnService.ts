import { EventStore } from '@core/domain'
import { okAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import {
  ImportDateMiseEnServiceManquanteError,
  ImportDateMiseEnServiceMauvaisFormatError,
} from '../errors'
import { isMatch } from 'date-fns'
import { User } from '@entities'

type ImportDatesMiseEnServiceErreurs =
  | ImportDateMiseEnServiceManquanteError
  | ImportDateMiseEnServiceMauvaisFormatError

type ImportDatesMiseEnServiceErreursArray = ImportDatesMiseEnServiceErreurs[]

type ImporterDatesMiseEnService = (commande: {
  utilisateur: User
  datesDeMiseEnServiceParNumeroDeGestionnaire: {
    numéroGestionnaire: string
    dateDeMiseEnService?: string
  }[]
}) => ResultAsync<null, InfraNotAvailableError | ImportDatesMiseEnServiceErreursArray>

type MakeImporterDatesMiseEnService = (dépendances: {
  publishToEventStore: EventStore['publish']
}) => ImporterDatesMiseEnService

export const makeImporterDatesMiseEnService: MakeImporterDatesMiseEnService =
  ({ publishToEventStore }) =>
  // vérifier que le user est admin ou dgec-validateur
  ({ datesDeMiseEnServiceParNumeroDeGestionnaire }) => {
    const erreurs: ImportDatesMiseEnServiceErreursArray = []
    datesDeMiseEnServiceParNumeroDeGestionnaire.forEach((line, index) => {
      if (!line.dateDeMiseEnService) {
        erreurs.push(new ImportDateMiseEnServiceManquanteError((index += 1)))
        return
      }
      if (!isMatch(line.dateDeMiseEnService, 'dd/mm/yyyy')) {
        erreurs.push(new ImportDateMiseEnServiceMauvaisFormatError((index += 1)))
        return
      }
    })

    if (erreurs.length) {
      // Emettre un événement qui va mettre à jour la projection TachesDeFond avec les erreurs
      // and then return okAsync(null)
    }

    // Emettre l'événement ImportDatesDeMiseEnServiceDémarré avec importData et ses dates au bon format
    // and then émettre un événement qui va mettre à jour la projection TachesDeFond ?
    // and then return okAsync(null)

    return okAsync(null)
  }

// Retirer les doublons :

// const numeroGestionnaireIds: string[] = linesResult.value.map(
//   (line: { numeroGestionnaire: string }) => line.numeroGestionnaire
// )

// if (numeroGestionnaireIds.length !== [...new Set(numeroGestionnaireIds)].length) {
//   return response.redirect(
//     addQueryParams(routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU, {
//       error: `L'import a échoué car le fichier comporte des numéros de gestionnaire en doublons.`,
//     })
//   )
// }
