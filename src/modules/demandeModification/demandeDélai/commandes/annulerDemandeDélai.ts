import { User } from '@entities'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { DélaiAnnulé } from '@modules/modificationRequest'

type annulerDemandeDélaiDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}

type annulerDemandeDélaiArgs = {
  projectId: string
  user: User
  demandeDélaiId: string
}

export const makeAnnulerDemandeDélai =
  (deps: annulerDemandeDélaiDeps) =>
  (
    args: annulerDemandeDélaiArgs
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { shouldUserAccessProject, demandeDélaiRepo, publishToEventStore } = deps
    const { projectId, user, demandeDélaiId } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user })).andThen(
      (userHasRightsToProject) => {
        if (!userHasRightsToProject) {
          return errAsync(new UnauthorizedError())
        }

        demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
          return publishToEventStore(
            new DélaiAnnulé({ payload: { demandeDélaiId, annuléPar: user.id } })
          )
        })
        return okAsync(null)
      }
    )
  }
