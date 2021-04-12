import { Repository, UniqueEntityID } from '../../../core/domain'
import { combineWithAllErrors, errAsync, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { AppelOffre } from '../AppelOffre'
import {
  AppelOffreDoesNotExistError,
  MissingAppelOffreIdError,
  MissingPeriodeIdError,
} from '../errors'
import { AppelOffreCreated } from '../events'

interface ImportPeriodeDataDeps {
  appelOffreRepo: Repository<AppelOffre>
  eventBus: EventBus
}

interface ImportPeriodeDataArgs {
  dataLines: any
  importedBy: User
}

export const makeImportPeriodeData = (deps: ImportPeriodeDataDeps) => ({
  dataLines,
  importedBy,
}: ImportPeriodeDataArgs): ResultAsync<
  null,
  (InfraNotAvailableError | UnauthorizedError | MissingAppelOffreIdError)[]
> => {
  const res: ResultAsync<
    null,
    InfraNotAvailableError | UnauthorizedError | MissingAppelOffreIdError
  >[] = dataLines.map((dataLine, index) => {
    const { appelOffreId, periodeId, ...data } = dataLine

    if (!appelOffreId) {
      return errAsync(new MissingAppelOffreIdError(index + 1))
    }

    if (!periodeId) {
      return errAsync(new MissingPeriodeIdError(index + 1))
    }

    return deps.appelOffreRepo
      .load(new UniqueEntityID(appelOffreId))
      .andThen((appelOffre) =>
        appelOffre.updatePeriode({ periodeId, data, updatedBy: importedBy }).map(() => appelOffre)
      )
      .andThen((appelOffre) => deps.appelOffreRepo.save(appelOffre))
      .orElse((e) => {
        if (e instanceof EntityNotFoundError) {
          return errAsync(new AppelOffreDoesNotExistError(appelOffreId, index + 1))
        }

        return errAsync(e)
      })
  })

  return combineWithAllErrors(res).map(() => null)
}
