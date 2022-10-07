import { EventStore } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import { ImportDateMiseEnServiceManquanteError } from '../errors'

type ImportDatesMiseEnServiceErreurs = ImportDateMiseEnServiceManquanteError[]

type ImporterDateMiseEnService = (commande: {
  importData: {
    numéroGestionnaire: string
    dateDeMiseEnService?: string
  }[]
}) => ResultAsync<ImportDatesMiseEnServiceErreurs | null, InfraNotAvailableError>

type MakeImporterDatesMiseEnService = (dépendances: {
  publishToEventStore: EventStore['publish']
}) => ImporterDateMiseEnService

export const makeImporterDatesMiseEnService: MakeImporterDatesMiseEnService =
  ({ publishToEventStore }) =>
  ({ importData }) => {
    const erreurs: ImportDatesMiseEnServiceErreurs = []
    importData.forEach((line, index) => {
      if (!line.dateDeMiseEnService) {
        erreurs.push(new ImportDateMiseEnServiceManquanteError((index += 1)))
        return
      }
    })

    if (erreurs.length) {
      return errAsync(erreurs)
    }

    return okAsync(null)
  }
