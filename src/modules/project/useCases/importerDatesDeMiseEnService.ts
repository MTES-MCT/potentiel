import { EventStore } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import {
  ImportDateMiseEnServiceManquanteError,
  ImportDateMiseEnServiceMauvaisFormatError,
  ImportDatesMiseEnServiceDoublonsError,
} from '../errors'
import { isMatch } from 'date-fns'
import { User } from '@entities'

type ImportDatesMiseEnServiceErreurs =
  | ImportDateMiseEnServiceManquanteError
  | ImportDateMiseEnServiceMauvaisFormatError
  | ImportDatesMiseEnServiceDoublonsError

type ImportDatesMiseEnServiceErreursArray = ImportDatesMiseEnServiceErreurs[]

type ImporterDatesMiseEnService = (commande: {
  utilisateur: User
  datesDeMiseEnServiceParNumeroDeGestionnaire: {
    numéroGestionnaire: string
    dateDeMiseEnService: string
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

    const numérosDeGestionnaireIds = datesDeMiseEnServiceParNumeroDeGestionnaire.map(
      (l) => l.numéroGestionnaire
    )

    datesDeMiseEnServiceParNumeroDeGestionnaire.forEach((line, index) => {
      if (!isMatch(line.dateDeMiseEnService, 'dd/mm/yyyy')) {
        erreurs.push(new ImportDateMiseEnServiceMauvaisFormatError((index += 1)))
        return
      }

      if (numérosDeGestionnaireIds.filter((id) => id === line.numéroGestionnaire).length > 1) {
        erreurs.push(new ImportDatesMiseEnServiceDoublonsError(line.numéroGestionnaire))
        return
      }
    })

    if (erreurs.length) {
      return errAsync(erreurs)
    }

    // @TODO
    // Emettre l'événement ImportDatesDeMiseEnServiceDémarré avec importData et ses dates au bon format
    // and then émettre un événement qui va mettre à jour la projection TachesDeFond ?
    // and then return okAsync(null)

    return okAsync(null)
  }

// Retirer les doublons :
