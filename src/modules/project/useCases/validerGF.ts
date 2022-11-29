import { EventStore } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { userIs } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectGFValidées } from '../events'

interface ValiderGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>

  publishToEventStore: EventStore['publish']
}

type ValiderGFArgs = {
  projetId: string
  validéesPar: User
}

export const makeValiderGF =
  (deps: ValiderGFDeps) =>
  (args: ValiderGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projetId, validéesPar } = args

    return wrapInfra(
      deps.shouldUserAccessProject({ projectId: projetId, user: validéesPar })
    ).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject || !userIs('dreal')(validéesPar)) {
          return errAsync(new UnauthorizedError())
        }

        return deps.publishToEventStore(
          new ProjectGFValidées({
            payload: { projetId, validéesPar: validéesPar.id },
          })
        )
      }
    )
  }
