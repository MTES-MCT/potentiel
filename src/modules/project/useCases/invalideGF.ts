import { EventStore } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { userIs } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { GFInvalidées } from '../events/GFInvalidées'

interface InvalideGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>

  publishToEventStore: EventStore['publish']
}

type InvalideGFArgs = {
  projetId: string
  invalidéesPar: User
}

export const makeInvalideGF =
  (deps: InvalideGFDeps) =>
  (args: InvalideGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projetId, invalidéesPar } = args

    return wrapInfra(
      deps.shouldUserAccessProject({ projectId: projetId, user: invalidéesPar })
    ).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject || !userIs('dreal')(invalidéesPar)) {
          return errAsync(new UnauthorizedError())
        }

        return deps.publishToEventStore(
          new GFInvalidées({
            payload: { projetId, invalidéesPar: invalidéesPar.id },
          })
        )
      }
    )
  }
