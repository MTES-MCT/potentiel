import { User } from '@entities'
import { EventStore, TransactionalRepository, Repository } from '@core/domain'
import { ResultAsync, errAsync } from '@core/utils'

import { userIsNot } from '@modules/users'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'

import { DemandeDélai } from '../DemandeDélai'

type PasserDemandeDélaiEnInstruction = (commande: {
  user: User
  demandeDélaiId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakePasserDemandeDélaiEnInstruction = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: Repository<DemandeDélai> & TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}) => PasserDemandeDélaiEnInstruction

export const makePasserDemandeDélaiEnInstruction: MakePasserDemandeDélaiEnInstruction =
  ({ shouldUserAccessProject, demandeDélaiRepo, publishToEventStore }) =>
  ({ user, demandeDélaiId }) => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }
    return null
  }
