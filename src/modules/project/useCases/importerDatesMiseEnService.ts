import { EventStore } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import {
  ImportDateMiseEnServiceManquanteError,
  ImportDateMiseEnServiceMauvaisFormatError,
} from '../errors'
import { isMatch } from 'date-fns'

type ImportDatesMiseEnServiceErreurs =
  | ImportDateMiseEnServiceManquanteError
  | ImportDateMiseEnServiceMauvaisFormatError

type ImportDatesMiseEnServiceErreursArray = ImportDatesMiseEnServiceErreurs[]

type ImporterDateMiseEnService = (commande: {
  importData: {
    numéroGestionnaire: string
    dateDeMiseEnService?: string
  }[]
}) => ResultAsync<null, InfraNotAvailableError | ImportDatesMiseEnServiceErreursArray>

type MakeImporterDatesMiseEnService = (dépendances: {
  publishToEventStore: EventStore['publish']
}) => ImporterDateMiseEnService

export const makeImporterDatesMiseEnService: MakeImporterDatesMiseEnService =
  ({ publishToEventStore }) =>
  ({ importData }) => {
    const erreurs: ImportDatesMiseEnServiceErreursArray = []
    importData.forEach((line, index) => {
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
      return errAsync(erreurs)
    }

    return okAsync(null)
  }
