import { User } from '@entities'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { DélaiAnnulé, StatusPreventsCancellingError } from '@modules/modificationRequest'

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
  ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError> => {
    const { shouldUserAccessProject, demandeDélaiRepo, publishToEventStore } = deps
    const { projectId, user, demandeDélaiId } = args

    return wrapInfra(shouldUserAccessProject({ projectId, user })).andThen(
      (userHasRightsToProject) => {
        if (!userHasRightsToProject) {
          return errAsync(new UnauthorizedError())
        }

        return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), ({ statut }) => {
          if (statut === 'envoyée' || statut === 'en-instruction') {
            return publishToEventStore(
              new DélaiAnnulé({ payload: { demandeDélaiId, annuléPar: user.id } })
            )
          }
          return errAsync(new StatusPreventsCancellingError(statut || 'inconnu'))
        })
      }
    )
  }
