import { User } from '@entities'
import { EventStore, TransactionalRepository, Repository, UniqueEntityID } from '@core/domain'
import { ResultAsync, errAsync } from '@core/utils'

import { userIsNot } from '@modules/users'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'

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
  demandeDélaiRepo: Repository<DemandeDélai> & TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}) => PasserDemandeDélaiEnInstruction

export const makePasserDemandeDélaiEnInstruction: MakePasserDemandeDélaiEnInstruction =
  ({ demandeDélaiRepo, publishToEventStore }) =>
  ({ user, demandeDélaiId }) => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.load(new UniqueEntityID(demandeDélaiId)).andThen((demandeDélai) => {
      const { statut } = demandeDélai

      if (!statut || statut !== 'envoyée') {
        return errAsync(new PasserEnInstructionDemandeDélaiStatutIncompatibleError(statut))
      }

      return null
    })
  }
