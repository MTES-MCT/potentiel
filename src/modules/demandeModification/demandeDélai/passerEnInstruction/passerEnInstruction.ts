import { User } from '@entities'
import { EventStore, TransactionalRepository, Repository, UniqueEntityID } from '@core/domain'
import { ResultAsync, errAsync, wrapInfra } from '@core/utils'

import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { DélaiEnInstruction } from '@modules/demandeModification/demandeDélai/events'

import { PasserEnInstructionDemandeDélaiStatutIncompatibleError } from './PasserEnInstructionDemandeDélaiStatutIncompatibleError'
import { DemandeDélai } from '../DemandeDélai'

type PasserDemandeDélaiEnInstruction = (commande: {
  user: User
  demandeDélaiId: string
}) => ResultAsync<
  null,
  | InfraNotAvailableError
  | UnauthorizedError
  | EntityNotFoundError
  | PasserEnInstructionDemandeDélaiStatutIncompatibleError
>

type MakePasserDemandeDélaiEnInstruction = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: Repository<DemandeDélai> & TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}) => PasserDemandeDélaiEnInstruction

export const makePasserDemandeDélaiEnInstruction: MakePasserDemandeDélaiEnInstruction =
  ({ demandeDélaiRepo, publishToEventStore, shouldUserAccessProject }) =>
  ({ user, demandeDélaiId }) => {
    return demandeDélaiRepo.transaction(
      new UniqueEntityID(demandeDélaiId),
      ({ statut = undefined, projetId = undefined }) => {
        if (!projetId) {
          return errAsync(new InfraNotAvailableError())
        }
        if (!statut || statut !== 'envoyée') {
          return errAsync(new PasserEnInstructionDemandeDélaiStatutIncompatibleError())
        }

        return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
          (
            userHasRightsToProject
          ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
            if (!userHasRightsToProject) {
              return errAsync(new UnauthorizedError())
            }

            return publishToEventStore(
              new DélaiEnInstruction({
                payload: {
                  demandeDélaiId,
                },
              })
            )
          }
        )
      }
    )
  }
