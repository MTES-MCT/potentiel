import { EventStore } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import {
  ImportDateMiseEnServiceMauvaisFormatError,
  ImportDatesMiseEnServiceDoublonsError,
} from '../errors'
import { isMatch } from 'date-fns'
import { User } from '@entities'
import { ImportDatesDeMiseEnServiceDémarré } from '../events'

type ImportDatesMiseEnServiceErreurs =
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
  ({ datesDeMiseEnServiceParNumeroDeGestionnaire, utilisateur }) => {
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

    return publishToEventStore(
      new ImportDatesDeMiseEnServiceDémarré({
        payload: {
          datesDeMiseEnServiceParNumeroDeGestionnaire,
          utilisateurId: utilisateur.id,
        },
      })
    ).andThen(() => okAsync(null))
  }
